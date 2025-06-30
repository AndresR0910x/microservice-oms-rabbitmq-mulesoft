package com.dispenser.orders_service.service;

import com.dispenser.orders_service.model.Orden;
import com.dispenser.orders_service.repository.OrdenRepository;
import com.dispenser.orders_service.dto.ClienteDTO;
import com.dispenser.orders_service.dto.OrdenProductoDTO;
import com.dispenser.orders_service.dto.ProductoDTO;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrdenService {
    //private static final Logger logger = LoggerFactory.getLogger(OrdenService.class);

    @Autowired
    private OrdenRepository ordenRepository;

    @Autowired
    private RestTemplate restTemplate;

    private final String CLIENTE_SERVICE_URL = "http://localhost:8083/api/clientes/";
    private final String PRODUCTO_SERVICE_URL = "http://localhost:8084/api/productos/";

    public Orden crearOrden(Orden orden) {
        if (orden.getIdCliente() == null) {
            throw new IllegalArgumentException("El ID del cliente es requerido");
        }
        ClienteDTO cliente = restTemplate.getForObject(CLIENTE_SERVICE_URL + orden.getIdCliente(), ClienteDTO.class);
        if (cliente == null) {
            throw new RuntimeException("Cliente no encontrado con ID: " + orden.getIdCliente());
        }
        orden.setCliente(cliente);

        if (orden.getProductos() != null) {
            for (OrdenProductoDTO op : orden.getProductos()) {
                ProductoDTO producto = restTemplate.getForObject(PRODUCTO_SERVICE_URL + op.getIdProducto(), ProductoDTO.class);
                if (producto == null || producto.getStock() < op.getCantidad()) {
                    throw new RuntimeException("Producto no disponible o stock insuficiente: " + op.getIdProducto());
                }
                orden.addProducto(op);
            }
        }

        Orden savedOrden = ordenRepository.save(orden);
        savedOrden.updateProductIds();
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

            if (ordenDetalles.getProductos() != null) {
                orden.getProductos().clear();
                for (OrdenProductoDTO op : ordenDetalles.getProductos()) {
                    ProductoDTO producto = restTemplate.getForObject(PRODUCTO_SERVICE_URL + op.getIdProducto(), ProductoDTO.class);
                    if (producto == null || producto.getStock() < op.getCantidad()) {
                        throw new RuntimeException("Producto no disponible o stock insuficiente: " + op.getIdProducto());
                    }
                    orden.addProducto(op);
                }
            }

            Orden updatedOrden = ordenRepository.save(orden);
            updatedOrden.updateProductIds();
            return updatedOrden;
        }
        throw new RuntimeException("Orden no encontrada con ID: " + id);
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