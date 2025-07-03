package com.dispenser.orders_service.service;

import com.dispenser.orders_service.config.RabbitMQConfig;
import com.dispenser.orders_service.model.Orden;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OrderUpdateListener {

    private static final Logger logger = LoggerFactory.getLogger(OrderUpdateListener.class);

    @Autowired
    private OrdenService ordenService;

    // Escuchar la cola de cobro completado
    @RabbitListener(queues = RabbitMQConfig.COBRO_COMPLETED_QUEUE)
    public void handleCobroCompleted(String message) {
        try {
            logger.info("Mensaje recibido en handleCobroCompleted: {}", message);

            // El mensaje tiene el formato: "Orden pagada - lista para enviar,idOrden=36,ubicacion=Dirección,totalEnvio=10.0,montoTotal=110.0"
            String[] parts = message.split(",");
            if (parts.length < 2) {
                logger.error("Formato de mensaje inválido: {}", message);
                return;
            }

            // Extraer idOrden
            String idOrdenPart = parts[1]; // idOrden=36
            String[] idOrdenSplit = idOrdenPart.split("=");
            if (idOrdenSplit.length != 2) {
                logger.error("Formato de idOrden inválido en el mensaje: {}", idOrdenPart);
                return;
            }

            Long idOrden = Long.parseLong(idOrdenSplit[1]);
            logger.info("ID de orden extraído: {}", idOrden);

            // Obtener la orden
            Orden orden = ordenService.obtenerOrdenPorId(idOrden);
            if (orden == null) {
                logger.error("Orden no encontrada con ID: {}", idOrden);
                return;
            }

            // Actualizar el estado a "Pagado" o "Orden pagada - lista para enviar"
            orden.setEstado("Pagado");
            ordenService.actualizarOrden(idOrden, orden);
            logger.info("Estado de la orden {} actualizado a 'Pagado'", idOrden);

        } catch (Exception e) {
            logger.error("Error al procesar el mensaje de cobro completado: {}", message, e);
        }
    }

    // Mantener el listener original si aún se necesita para otros casos
    @RabbitListener(queues = RabbitMQConfig.ORDER_UPDATE_QUEUE)
    public void handleOrderUpdate(String message) {
        try {
            logger.info("Mensaje recibido en handleOrderUpdate: {}", message);

            String[] parts = message.split(",");
            if (parts.length < 2) {
                logger.error("Formato de mensaje inválido: {}", message);
                return;
            }

            String idOrdenPart = parts[0]; // idOrden=36
            String estadoPart = parts[1];  // estado=Pagado y enviado

            String[] idOrdenSplit = idOrdenPart.split("=");
            if (idOrdenSplit.length != 2) {
                logger.error("Formato de idOrden inválido en el mensaje: {}", idOrdenPart);
                return;
            }

            Long idOrden = Long.parseLong(idOrdenSplit[1]);
            logger.info("ID de orden extraído: {}", idOrden);

            String[] estadoSplit = estadoPart.split("=");
            if (estadoSplit.length != 2) {
                logger.error("Formato de estado inválido en el mensaje: {}", estadoPart);
                return;
            }

            String nuevoEstado = estadoSplit[1];
            logger.info("Nuevo estado extraído: {}", nuevoEstado);

            Orden orden = ordenService.obtenerOrdenPorId(idOrden);
            if (orden == null) {
                logger.error("Orden no encontrada con ID: {}", idOrden);
                return;
            }

            orden.setEstado(nuevoEstado);
            ordenService.actualizarOrden(idOrden, orden);
            logger.info("Estado de la orden {} actualizado a '{}'", idOrden, nuevoEstado);

        } catch (Exception e) {
            logger.error("Error al procesar el mensaje de actualización de orden: {}", message, e);
        }
    }
}