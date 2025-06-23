package com.dispenser.orders_service.service;

import com.dispenser.orders_service.model.Order;
import com.dispenser.orders_service.repository.OrdenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class OrdenService {
    private final OrdenRepository ordenRepository;

    public OrdenService(OrdenRepository ordenRepository) {
        this.ordenRepository = ordenRepository;
    }

    public Order crearOrden(Order orden) {
        orden.setFechaCreacion(LocalDateTime.now());
        orden.setEstado("CREADA");
        return ordenRepository.save(orden);
    }

    public Order actualizarEstado(Long id, String estado) {
        Order orden = ordenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        orden.setEstado(estado);
        return ordenRepository.save(orden);
    }
}