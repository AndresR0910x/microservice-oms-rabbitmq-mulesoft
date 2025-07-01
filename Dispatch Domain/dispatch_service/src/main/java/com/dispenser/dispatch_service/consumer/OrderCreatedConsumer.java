package com.dispenser.dispatch_service.consumer;

import com.dispenser.dispatch_service.model.Despacho;
import com.dispenser.dispatch_service.service.DespachoService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OrderCreatedConsumer {

    @Autowired
    private DespachoService despachoService;

    @RabbitListener(queues = "#{rabbitMQConfig.orderCreatedQueue().getName()}")
    public void processOrderCreated(String message) {
        String[] parts = message.split(",");
        if (parts.length < 2) {
            throw new IllegalArgumentException("Mensaje inválido: se requieren idOrden y estado");
        }
        Long idOrden = Long.parseLong(parts[0]);
        String estadoInicial = parts[1];

        // Verificar si ya existe un despacho para esta orden
        if (!despachoService.obtenerDespachoPorIdOrden(idOrden).isPresent()) {
            Despacho despacho = new Despacho();
            despacho.setIdOrden(idOrden);
            despacho.setFechaDespacho(null);
            despacho.setEstado(estadoInicial); // Ejemplo: "pendiente de pago"
            despacho.setDireccionEntrega(null);
            despacho.setTotalEnvio(0.0); // Inicialmente 0 hasta que se cobre
            despachoService.save(despacho);
        }
    }
}