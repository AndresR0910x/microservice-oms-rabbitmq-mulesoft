package com.dispenser.dispatch_service.consumer;

import com.dispenser.dispatch_service.model.Despacho;
import com.dispenser.dispatch_service.service.DespachoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CobroCompletedConsumer {

    private static final Logger logger = LoggerFactory.getLogger(CobroCompletedConsumer.class);

    @Autowired
    private DespachoService despachoService;

    @RabbitListener(queues = "#{rabbitMQConfig.dispatchUpdateQueue().getName()}")
    public void processCobroCompleted(String message) {
        logger.info("Mensaje recibido en CobroCompletedConsumer: {}", message);

        try {
            String[] parts = message.split(",");
            if (parts.length < 4) {
                throw new IllegalArgumentException("Mensaje inválido: se requieren idOrden, ubicacion, totalEnvio y montoTotal");
            }

            Long idOrden = Long.parseLong(parts[1].split("=")[1]); // idOrden=23
            String ubicacion = parts[2].split("=")[1]; // ubicacion=...
            double totalEnvio = Double.parseDouble(parts[3].split("=")[1]); // totalEnvio=47.00
            double montoTotal = Double.parseDouble(parts[4].split("=")[1]); // montoTotal=147.00

            // Obtener o crear el despacho
            Despacho despacho = despachoService.obtenerDespachoPorIdOrden(idOrden)
                    .orElseGet(() -> {
                        Despacho newDespacho = new Despacho();
                        newDespacho.setIdOrden(idOrden);
                        return newDespacho;
                    });

            // Actualizar el despacho
            despacho.setEstado("Orden pagada - lista para enviar");
            despacho.setDireccionEntrega(ubicacion);
            despacho.setTotalEnvio(totalEnvio);
            despachoService.save(despacho);

            logger.info("Despacho actualizado para orden {}: Estado={}, Ubicación={}, TotalEnvio={}, MontoTotal={}",
                    idOrden, despacho.getEstado(), despacho.getDireccionEntrega(), despacho.getTotalEnvio(), montoTotal);
        } catch (Exception e) {
            logger.error("Error al procesar mensaje de cobro completado: {}", e.getMessage(), e);
        }
    }
}