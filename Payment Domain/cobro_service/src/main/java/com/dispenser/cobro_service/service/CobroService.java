package com.dispenser.cobro_service.service;

import com.dispenser.cobro_service.model.Cobro;
import com.dispenser.cobro_service.dto.*;
import com.dispenser.cobro_service.repository.CobroRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@Service
public class CobroService {
    @Autowired
    private CobroRepository cobroRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private final String ORDERS_SERVICE_URL = "http://localhost:8081/api/ordenes/";
    private final String COBRO_COMPLETED_EXCHANGE = "cobro.completed.exchange";
    private final String COBRO_COMPLETED_ROUTING_KEY = "cobro.completed";

    public Cobro crearCobro(Long idOrden, Double monto, String metodoPago) {
        OrdenDTO orden = restTemplate.getForObject(ORDERS_SERVICE_URL + idOrden, OrdenDTO.class);
        if (orden == null) {
            throw new RuntimeException("Orden no encontrada con ID: " + idOrden);
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

        cobro.setEstado("completado"); // Simulación de éxito
        Cobro savedCobro = cobroRepository.save(cobro);

        // Publicar mensaje a RabbitMQ
        rabbitTemplate.convertAndSend(
                COBRO_COMPLETED_EXCHANGE,
                COBRO_COMPLETED_ROUTING_KEY,
                savedCobro.getIdOrden() + "," + savedCobro.getIdCobro()
        );

        return savedCobro;
    }

    public Cobro obtenerCobroPorId(Long idCobro) {
        return cobroRepository.findById(idCobro)
                .orElseThrow(() -> new RuntimeException("Cobro no encontrado con ID: " + idCobro));
    }

    public Cobro actualizarCobro(Long idCobro, Double costoEnvio) {
        Cobro cobro = cobroRepository.findById(idCobro)
                .orElseThrow(() -> new RuntimeException("Cobro no encontrado con ID: " + idCobro));
        if (costoEnvio != null) {
            cobro.setCostoEnvio(costoEnvio);
            cobro.setMonto(cobro.getMonto() + costoEnvio);
        }
        return cobroRepository.save(cobro);
    }

    private String generateTransactionId() {
        return "TXN-" + System.currentTimeMillis();
    }
}