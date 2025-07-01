package com.dispenser.dispatch_service.service;

import com.dispenser.dispatch_service.model.Despacho;
import com.dispenser.dispatch_service.dto.OrdenDTO;
import com.dispenser.dispatch_service.repository.DespachoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DespachoService {
    private static final Logger logger = LoggerFactory.getLogger(DespachoService.class);

    @Autowired
    private DespachoRepository despachoRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private final String ORDERS_SERVICE_URL = "http://ORDERS_SERVICE/api/ordenes/";
    private final String DISPATCH_UPDATED_EXCHANGE = "dispatch.updated.exchange";
    private final String DISPATCH_UPDATED_ROUTING_KEY = "dispatch.updated";
    private final String DESPACHO_UPDATE_EXCHANGE = "despacho.update.exchange"; // Nuevo exchange para recibir actualizaciones

    public Despacho crearDespacho(Long idOrden) {
        OrdenDTO orden = restTemplate.getForObject(ORDERS_SERVICE_URL + idOrden, OrdenDTO.class);
        if (orden == null) {
            throw new RuntimeException("Orden no encontrada con ID: " + idOrden);
        }

        Despacho despacho = new Despacho();
        despacho.setIdOrden(idOrden);
        despacho.setFechaDespacho(null);
        despacho.setEstado("pendiente");
        despacho.setDireccionEntrega(null);
        Despacho savedDespacho = despachoRepository.save(despacho);
        logger.info("Despacho creado para idOrden {} con ID {}", idOrden, savedDespacho.getIdDespacho());
        return savedDespacho;
    }

    public Optional<Despacho> obtenerDespachoPorIdOrden(Long idOrden) {
        return despachoRepository.findByIdOrden(idOrden);
    }

    public Despacho obtenerDespachoPorId(Long idDespacho) {
        return despachoRepository.findById(idDespacho)
                .orElseThrow(() -> new RuntimeException("Despacho no encontrado con ID: " + idDespacho));
    }

    public Despacho agendarDespacho(Long idDespacho, LocalDateTime fechaDespacho, String estado, String direccionEntrega) {
        Despacho despacho = despachoRepository.findById(idDespacho)
                .orElseThrow(() -> new RuntimeException("Despacho no encontrado con ID: " + idDespacho));
        if (fechaDespacho != null) despacho.setFechaDespacho(fechaDespacho);
        if (estado != null) despacho.setEstado(estado);
        if (direccionEntrega != null) despacho.setDireccionEntrega(direccionEntrega);
        Despacho savedDespacho = despachoRepository.save(despacho);

        // Publicar mensaje cuando se asigne la fecha
        if (fechaDespacho != null) {
            String message = savedDespacho.getIdDespacho() + "," + savedDespacho.getIdOrden();
            rabbitTemplate.convertAndSend(DISPATCH_UPDATED_EXCHANGE, DISPATCH_UPDATED_ROUTING_KEY, message);
            logger.info("Mensaje enviado a {} con Routing Key {}: {}", DISPATCH_UPDATED_EXCHANGE, DISPATCH_UPDATED_ROUTING_KEY, message);
        }
        return savedDespacho;
    }

    public Despacho save(Despacho despacho) {
        Despacho savedDespacho = despachoRepository.save(despacho);
        logger.info("Despacho guardado con ID {}", savedDespacho.getIdDespacho());
        return savedDespacho;
    }
    public List<Despacho> obtenerTodosLosDespachos() {
    return despachoRepository.findAll(); 
}
}