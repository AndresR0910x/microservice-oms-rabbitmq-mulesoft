package com.dispenser.dispatch_service.consumer;

import com.dispenser.dispatch_service.model.Despacho;
import com.dispenser.dispatch_service.service.DespachoService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DespachoConsumer {

    @Autowired
    private DespachoService despachoService;

    @RabbitListener(queues = "#{rabbitMQConfig.dispatchUpdateQueue().getName()}")
    public void processCobroCompleted(String message) {
        String[] parts = message.split(",");
        Long idOrden = Long.parseLong(parts[0]);
        // Ignoramos idCobro por ahora, pero podría usarse para validación

        Despacho despacho = despachoService.obtenerDespachoPorIdOrden(idOrden)
                .orElseThrow(() -> new RuntimeException("Despacho no encontrado para orden ID: " + idOrden));
        despacho.setEstado("Orden cobrada - Orden lista para envío");
        despacho.setFechaDespacho(null); // Se asignará manualmente
        despachoService.save(despacho);
    }
}