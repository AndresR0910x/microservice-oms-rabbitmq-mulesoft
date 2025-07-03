package com.dispenser.orders_service.service;

import com.dispenser.orders_service.config.RabbitMQConfig;
import com.dispenser.orders_service.model.Orden;
import com.dispenser.orders_service.model.OrdenProducto;
import com.dispenser.orders_service.repository.OrdenRepository;
import com.dispenser.orders_service.dto.ClienteDTO;
import com.dispenser.orders_service.dto.OrdenProductoDTO;
import com.dispenser.orders_service.dto.ProductoDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrdenService {

    private static final Logger logger = LoggerFactory.getLogger(OrdenService.class);

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private final String CLIENTE_SERVICE_URL = "http://CLIENTE-SERVICE/api/clientes/";
    private final String PRODUCTO_SERVICE_URL = "http://PRODUCT-SERVICE/api/productos/";
    private final String DISPATCH_SERVICE_URL = "http://DISPATCH-SERVICE/api/despachos/";

    public Orden crearOrden(Orden orden) {
        if (orden.getIdCliente() == null) {
            throw new IllegalArgumentException("El ID del cliente es requerido");
        }
        ClienteDTO cliente = restTemplate.getForObject(CLIENTE_SERVICE_URL + orden.getIdCliente(), ClienteDTO.class);
        if (cliente == null) {
            throw new RuntimeException("Cliente no encontrado con ID: " + orden.getIdCliente());
        }
        orden.setCliente(cliente);

        if (orden.getProductos() != null && !orden.getProductos().isEmpty()) {
            orden.getOrderProducts().clear();
            for (OrdenProductoDTO opDTO : orden.getProductos()) {
                ProductoDTO producto = restTemplate.getForObject(PRODUCTO_SERVICE_URL + opDTO.getIdProducto(), ProductoDTO.class);
                if (producto == null || producto.getStock() < opDTO.getCantidad()) {
                    throw new RuntimeException("Producto no disponible o stock insuficiente: " + opDTO.getIdProducto());
                }
                OrdenProducto op = new OrdenProducto();
                op.setIdProducto(opDTO.getIdProducto());
                op.setCantidad(opDTO.getCantidad());
                op.setOrden(orden);
                orden.getOrderProducts().add(op);
            }
        }

        Orden savedOrden = ordenRepository.save(orden);
        savedOrden.updateProductIds();

        // Enviar mensaje a dispatch-service para crear despacho
        String dispatchMessage = savedOrden.getIdOrden() + ",pendiente de pago";
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.ORDER_CREATED_EXCHANGE,
                RabbitMQConfig.ORDER_CREATED_ROUTING_KEY,
                dispatchMessage
        );
        logger.info("Mensaje enviado a {} con routing key {}: {}", RabbitMQConfig.ORDER_CREATED_EXCHANGE, RabbitMQConfig.ORDER_CREATED_ROUTING_KEY, dispatchMessage);

        // Enviar mensaje para actualizar el stock de productos
        if (!orden.getOrderProducts().isEmpty()) {
            StringBuilder stockMessage = new StringBuilder();
            for (OrdenProducto op : orden.getOrderProducts()) {
                stockMessage.append(op.getIdProducto()).append(":").append(op.getCantidad()).append(",");
            }
            stockMessage.setLength(stockMessage.length() - 1); // Eliminar la última coma
            String stockUpdateMessage = stockMessage.toString();
            rabbitTemplate.convertAndSend(
                    RabbitMQConfig.ORDER_PRODUCTS_EXCHANGE,
                    RabbitMQConfig.ORDER_PRODUCTS_ROUTING_KEY,
                    stockUpdateMessage
            );
            logger.info("Mensaje enviado a {} con routing key {}: {}", RabbitMQConfig.ORDER_PRODUCTS_EXCHANGE, RabbitMQConfig.ORDER_PRODUCTS_ROUTING_KEY, stockUpdateMessage);
        }

        return savedOrden;
    }

    public Orden actualizarOrden(Long id, Orden ordenDetalles) {
        Optional<Orden> ordenOptional = ordenRepository.findById(id);
        if (ordenOptional.isPresent()) {
            Orden orden = ordenOptional.get();

            if (ordenDetalles.getIdCliente() != null) {
                ClienteDTO cliente = restTemplate.getForObject(CLIENTE_SERVICE_URL + ordenDetalles.getIdCliente(), ClienteDTO.class);
                if (cliente == null) {
                    throw new RuntimeException("Cliente no encontrado con ID: " + ordenDetalles.getIdCliente());
                }
                orden.setCliente(cliente);
                orden.setIdCliente(ordenDetalles.getIdCliente());
            }

            if (ordenDetalles.getFecha() != null) orden.setFecha(ordenDetalles.getFecha());
            if (ordenDetalles.getEstado() != null) orden.setEstado(ordenDetalles.getEstado());

            if (ordenDetalles.getProductos() != null && !ordenDetalles.getProductos().isEmpty()) {
                orden.getOrderProducts().clear();
                for (OrdenProductoDTO opDTO : ordenDetalles.getProductos()) {
                    ProductoDTO producto = restTemplate.getForObject(PRODUCTO_SERVICE_URL + opDTO.getIdProducto(), ProductoDTO.class);
                    if (producto == null || producto.getStock() < opDTO.getCantidad()) {
                        throw new RuntimeException("Producto no disponible o stock insuficiente: " + opDTO.getIdProducto());
                    }
                    OrdenProducto op = new OrdenProducto();
                    op.setIdProducto(opDTO.getIdProducto());
                    op.setCantidad(opDTO.getCantidad());
                    op.setOrden(orden);
                    orden.getOrderProducts().add(op);
                }
            }

            // Si el estado es "cobrado", procesar ubicación y total de envío
            if ("cobrado".equalsIgnoreCase(ordenDetalles.getEstado()) && ordenDetalles.getProductos() != null) {
                ClienteDTO cliente = orden.getCliente();
                if (cliente == null && orden.getIdCliente() != null) {
                    cliente = restTemplate.getForObject(CLIENTE_SERVICE_URL + orden.getIdCliente(), ClienteDTO.class);
                }
                String ubicacionEntrega = (cliente != null) ? cliente.getDireccion() : "Dirección no especificada";
                double totalEnvio = calcularTotalEnvio(ordenDetalles.getProductos(), ubicacionEntrega);
                enviarActualizacionDespacho(id, ubicacionEntrega, totalEnvio);
            }

            Orden updatedOrden = ordenRepository.save(orden);
            updatedOrden.updateProductIds();
            return updatedOrden;
        }
        throw new RuntimeException("Orden no encontrada con ID: " + id);
    }

    private double calcularTotalEnvio(Set<OrdenProductoDTO> productos, String ubicacionEntrega) {
        double costoBasePorProducto = 5.0;
        double costoDistancia = ubicacionEntrega != null ? ubicacionEntrega.length() * 0.5 : 0.0;
        double costoTotalProductos = productos.stream().mapToInt(OrdenProductoDTO::getCantidad).sum() * costoBasePorProducto;
        return costoTotalProductos + costoDistancia;
    }

    private void enviarActualizacionDespacho(Long idOrden, String ubicacionEntrega, double totalEnvio) {
        String message = idOrden + "," + ubicacionEntrega + "," + totalEnvio;
        rabbitTemplate.convertAndSend(
                "cobro.completed.exchange",
                "cobro.completed",
                message
        );
    }

    public List<Orden> obtenerTodasLasOrdenes() {
        List<Orden> ordenes = ordenRepository.findAll();
        return ordenes.stream().map(this::fillCliente).collect(Collectors.toList());
    }

    public List<Orden> obtenerOrdenesPorCliente(Long idCliente) {
        List<Orden> ordenes = ordenRepository.findByIdCliente(idCliente);
        return ordenes.stream().map(this::fillCliente).collect(Collectors.toList());
    }

    public Orden obtenerOrdenPorId(Long id) {
        Orden orden = ordenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada con ID: " + id));
        return fillCliente(orden);
    }

    public void eliminarOrden(Long id) {
        ordenRepository.deleteById(id);
    }

    public List<Orden> obtenerOrdenesPorEstado(String estado) {
        return ordenRepository.findAll().stream()
                .filter(orden -> orden.getEstado() != null && orden.getEstado().equalsIgnoreCase(estado))
                .map(this::fillCliente)
                .collect(Collectors.toList());
    }

    public Long contarOrdenesPorCliente(Long idCliente) {
        return ordenRepository.countByIdCliente(idCliente);
    }

    private Orden fillCliente(Orden orden) {
        if (orden.getIdCliente() != null) {
            ClienteDTO cliente = restTemplate.getForObject(CLIENTE_SERVICE_URL + orden.getIdCliente(), ClienteDTO.class);
            if (cliente != null) {
                orden.setCliente(cliente);
            }
        }
        return orden;
    }
}