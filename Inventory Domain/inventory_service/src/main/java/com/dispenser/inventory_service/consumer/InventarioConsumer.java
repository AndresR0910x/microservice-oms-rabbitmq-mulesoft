package com.dispenser.inventory_service.consumer;

import com.dispenser.inventory_service.model.Inventario;
import com.dispenser.inventory_service.service.InventarioService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class InventarioConsumer {
    @Autowired
    private InventarioService inventarioService;

    @RabbitListener(queues = "${rabbitmq.queue.product.created}") // Asegúrate de que esta propiedad esté definida
    public void processProductCreated(String message) {
        System.out.println("Mensaje recibido en InventarioConsumer: " + message); // Log para depuración
        try {
            String[] parts = message.split(",");
            if (parts.length == 2) {
                Long idProducto = Long.parseLong(parts[0]);
                Integer stockInicial = Integer.parseInt(parts[1]);

                Inventario inventario = inventarioService.crearInventarioParaProducto(idProducto, stockInicial);
                System.out.println("Inventario creado para producto ID: " + idProducto + " con stock: " + stockInicial);
            } else {
                System.out.println("Formato de mensaje inválido: " + message);
            }
        } catch (Exception e) {
            System.out.println("Error procesando mensaje: " + e.getMessage());
        }
    }
}