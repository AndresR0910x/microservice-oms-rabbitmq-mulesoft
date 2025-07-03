package com.dispenser.product.service;

import com.dispenser.product.config.RabbitMQConfig;
import com.dispenser.product.model.Producto;
import com.dispenser.product.repository.ProductoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductoMessageListener {

    private static final Logger logger = LoggerFactory.getLogger(ProductoMessageListener.class);

    @Autowired
    private ProductoRepository productoRepository;

    @RabbitListener(queues = RabbitMQConfig.ORDER_PRODUCTS_QUEUE)
    public void handleOrderProducts(String message) {
        try {
            logger.info("Mensaje recibido en la cola {}: {}", RabbitMQConfig.ORDER_PRODUCTS_QUEUE, message);

            String[] productUpdates = message.split(",");
            for (String update : productUpdates) {
                String[] parts = update.split(":");
                if (parts.length == 2) {
                    Long idProducto = Long.parseLong(parts[0]);
                    Integer cantidad = Integer.parseInt(parts[1]);

                    Producto producto = productoRepository.findById(idProducto)
                            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + idProducto));
                    int nuevoStock = producto.getStock() - cantidad;
                    if (nuevoStock < 0) {
                        throw new RuntimeException("Stock insuficiente para el producto ID: " + idProducto);
                    }
                    producto.setStock(nuevoStock);
                    productoRepository.save(producto);
                    logger.info("Stock actualizado para producto ID {}: {}", idProducto, nuevoStock);
                } else {
                    logger.error("Formato de actualización inválido: {}", update);
                }
            }
        } catch (Exception e) {
            logger.error("Error al procesar el mensaje de actualización de stock: {}", message, e);
        }
    }
}