package com.dispenser.dispatch_service.consumer;

import com.dispenser.dispatch_service.model.Despacho;
import com.dispenser.dispatch_service.service.DespachoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DespachoUpdateConsumer {

    private static final Logger logger = LoggerFactory.getLogger(DespachoUpdateConsumer.class);

    @Autowired
    private DespachoService despachoService;

    @RabbitListener(queues = "despacho.update.queue")
    public void processDespachoUpdate(String message) {
        logger.info("Mensaje recibido en DespachoUpdateConsumer: {}", message);

        try {
            String[] parts = message.split(",");
            if (parts.length < 3) {
                throw new IllegalArgumentException("Mensaje inválido: se requieren idDespacho, estado y fechaDespacho");
            }

            Long idDespacho = Long.parseLong(parts[0].split("=")[1]); // idDespacho=X
            String estado = parts[1].split("=")[1];                   // estado=enviada
            LocalDateTime fechaDespacho = LocalDateTime.parse(parts[2].split("=")[1]); // fechaDespacho=2025-06-30T...

            Despacho despacho = despachoService.obtenerDespachoPorId(idDespacho);
            if (despacho == null) {
                logger.warn("Despacho no encontrado con ID: {}", idDespacho);
                return;
            }

            despacho.setEstado(estado);
            despacho.setFechaDespacho(fechaDespacho);
            despachoService.save(despacho);

            logger.info("Despacho actualizado - ID: {}, Estado: {}, FechaDespacho: {}",
                    idDespacho, despacho.getEstado(), despacho.getFechaDespacho());
        } catch (Exception e) {
            logger.error("Error al actualizar despacho: {}", e.getMessage(), e);
        }
    }
}