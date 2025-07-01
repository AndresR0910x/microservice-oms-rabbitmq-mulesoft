package com.dispenser.cobro_service.service;

import com.dispenser.cobro_service.model.Cobro;
import com.dispenser.cobro_service.repository.CobroRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

@Service
public class CobroService {
    private static final Logger logger = LoggerFactory.getLogger(CobroService.class);

    @Autowired
    private CobroRepository cobroRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private final String ORDERS_SERVICE_URL = "http://ORDERS-SERVICE/api/ordenes/";
    private final String DESPACHO_SERVICE_URL = "http://DISPATCH-SERVICE/api/despachos/";

    private final String COBRO_COMPLETED_EXCHANGE = "cobro.completed.exchange";
    private final String COBRO_COMPLETED_ROUTING_KEY = "cobro.completed";

    public Cobro crearCobro(Long idOrden, Double monto, String metodoPago) {
        // Verificar si la orden ya está pagada en despacho
        DespachoDTO despacho = null;
        try {
            String url = DESPACHO_SERVICE_URL + "obtenerPorIdOrden?idOrden=" + idOrden;
            logger.info("Intentando consultar despacho en URL: {}", url);
            despacho = restTemplate.getForObject(url, DespachoDTO.class);
            logger.info("Respuesta del despacho-service para idOrden {}: Estado = {}, Objeto completo = {}", idOrden,
                       (despacho != null ? despacho.getEstado() : "null"), despacho);
            if (despacho != null && "Orden pagada - lista para enviar".equals(despacho.getEstado())) {
                logger.warn("Intento de pago duplicado detectado para idOrden {}", idOrden);
                throw new ResponseStatusException(HttpStatus.CONFLICT, "La orden " + idOrden + " ya ha sido pagada y no se puede procesar nuevamente.");
            }
        } catch (HttpClientErrorException e) {
            logger.error("Error HTTP al consultar despacho para idOrden {}: Status = {}, Response = {}", idOrden, e.getStatusCode(), e.getResponseBodyAsString());
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                logger.info("No se encontró despacho para idOrden {}, procediendo con el pago.", idOrden);
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al verificar el estado del despacho: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);
            }
        } catch (Exception e) {
            logger.error("Excepción inesperada al consultar despacho para idOrden {}: {}", idOrden, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error inesperado al verificar el estado del despacho: " + e.getMessage(), e);
        }

        // Obtener la orden desde orders-service
        OrdenDTO orden;
        try {
            orden = restTemplate.getForObject(ORDERS_SERVICE_URL + idOrden, OrdenDTO.class);
            if (orden == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden no encontrada con ID: " + idOrden);
            }
        } catch (HttpClientErrorException e) {
            logger.error("Error al consultar la orden con ID {}: {}", idOrden, e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al obtener la orden: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            logger.error("Excepción inesperada al consultar la orden con ID {}: {}", idOrden, e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error inesperado al obtener la orden", e);
        }

        Cobro cobro = new Cobro();
        cobro.setIdOrden(idOrden);
        cobro.setMonto(monto);
        cobro.setMetodoPago(metodoPago);
        cobro.setFechaCobro(LocalDateTime.now());
        cobro.setEstado("pendiente");
        cobro.setTransaccionId(generateTransactionId());
        cobro.setCostoEnvio(0.0);
        cobro.setMoneda("USD");

        // Simulación de éxito del cobro
        cobro.setEstado("completado");
        Cobro savedCobro = cobroRepository.save(cobro);

        // Obtener la dirección del cliente
        String ubicacionEntrega = orden.getCliente() != null ? orden.getCliente().getDireccion() : "Dirección no especificada";
        double totalEnvio = calcularTotalEnvio(orden.getOrderProducts(), ubicacionEntrega);
        savedCobro.setCostoEnvio(totalEnvio);

        // Calcular monto total
        double montoTotal = monto + totalEnvio;
        savedCobro.setMontoTotal(montoTotal);

        cobroRepository.save(savedCobro);

        // Publicar mensaje a RabbitMQ con estado, ubicación, totalEnvio y montoTotal
        Locale.setDefault(Locale.US); // Para evitar coma como separador decimal
        String message = String.format(Locale.US,
            "Orden pagada - lista para enviar,idOrden=%d,ubicacion=%s,totalEnvio=%.2f,montoTotal=%.2f",
            savedCobro.getIdOrden(), ubicacionEntrega, totalEnvio, montoTotal);
        rabbitTemplate.convertAndSend(COBRO_COMPLETED_EXCHANGE, COBRO_COMPLETED_ROUTING_KEY, message);
        logger.info("Mensaje enviado a RabbitMQ - Exchange: {}, Routing Key: {}, Message: {}", COBRO_COMPLETED_EXCHANGE, COBRO_COMPLETED_ROUTING_KEY, message);

        return savedCobro;
    }

    public Cobro obtenerCobroPorId(Long idCobro) {
        return cobroRepository.findById(idCobro)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cobro no encontrado con ID: " + idCobro));
    }

    public Cobro actualizarCobro(Long idCobro, Double costoEnvio) {
        Cobro cobro = cobroRepository.findById(idCobro)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cobro no encontrado con ID: " + idCobro));
        if (costoEnvio != null) {
            cobro.setCostoEnvio(costoEnvio);
            cobro.setMontoTotal(cobro.getMonto() + costoEnvio);
        }
        return cobroRepository.save(cobro);
    }

    private double calcularTotalEnvio(Set<OrdenProductoDTO> orderProducts, String ubicacionEntrega) {
        double costoBasePorProducto = 5.0;
        double costoDistancia = ubicacionEntrega != null ? ubicacionEntrega.length() * 0.5 : 0.0;
        double costoTotalProductos = orderProducts.stream().mapToInt(OrdenProductoDTO::getCantidad).sum() * costoBasePorProducto;
        return costoTotalProductos + costoDistancia;
    }

    private String generateTransactionId() {
        return "TXN-" + System.currentTimeMillis();
    }
}

// DTOs
class OrdenDTO {
    private Long idOrden;
    private String fecha;
    private String estado;
    private Long idCliente;
    private ClienteDTO cliente;
    private Set<OrdenProductoDTO> orderProducts = new HashSet<>();

    // Getters y setters
    public Long getIdOrden() { return idOrden; }
    public void setIdOrden(Long idOrden) { this.idOrden = idOrden; }
    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }
    public ClienteDTO getCliente() { return cliente; }
    public void setCliente(ClienteDTO cliente) { this.cliente = cliente; }
    public Set<OrdenProductoDTO> getOrderProducts() { return orderProducts; }
    public void setOrderProducts(Set<OrdenProductoDTO> orderProducts) { this.orderProducts = orderProducts; }
}

class ClienteDTO {
    private Long idCliente;
    private String nombre;
    private String direccion;
    private String contacto;

    // Getters y setters
    public Long getIdCliente() { return idCliente; }
    public void setIdCliente(Long idCliente) { this.idCliente = idCliente; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getContacto() { return contacto; }
    public void setContacto(String contacto) { this.contacto = contacto; }
}

class OrdenProductoDTO {
    private Long idOrdenProducto;
    private Long idProducto;
    private Integer cantidad;

    // Getters y setters
    public Long getIdOrdenProducto() { return idOrdenProducto; }
    public void setIdOrdenProducto(Long idOrdenProducto) { this.idOrdenProducto = idOrdenProducto; }
    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}

class DespachoDTO {
    private Long idOrden;
    private String estado;

    // Getters y setters
    public Long getIdOrden() { return idOrden; }
    public void setIdOrden(Long idOrden) { this.idOrden = idOrden; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}