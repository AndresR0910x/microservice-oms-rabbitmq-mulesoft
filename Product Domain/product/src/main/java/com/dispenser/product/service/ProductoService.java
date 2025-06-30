package com.dispenser.product.service;

import com.dispenser.product.config.RabbitMQConfig;
import com.dispenser.product.model.Producto;
import com.dispenser.product.repository.ProductoRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {
    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public Producto crearProducto(Producto producto) {
        Producto savedProducto = productoRepository.save(producto);
        String message = savedProducto.getIdProducto() + "," + (savedProducto.getStock() != null ? savedProducto.getStock() : 0);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.PRODUCT_CREATED_EXCHANGE,
                RabbitMQConfig.ROUTING_KEY,
                message
        );
        System.out.println("Mensaje enviado a RabbitMQ: " + message); // Log para depuración
        return savedProducto;
    }

    public List<Producto> obtenerTodosLosProductos() {
        return productoRepository.findAll();
    }

    public Producto actualizarProducto(Long id, Producto productoDetalles) {
        Optional<Producto> productoExistente = productoRepository.findById(id);
        if (productoExistente.isPresent()) {
            Producto producto = productoExistente.get();
            producto.setNombre(productoDetalles.getNombre());
            producto.setPrecio(productoDetalles.getPrecio());
            producto.setStock(productoDetalles.getStock());
            return productoRepository.save(producto);
        }
        throw new RuntimeException("Producto no encontrado");
    }

    public Producto obtenerProductoPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
}