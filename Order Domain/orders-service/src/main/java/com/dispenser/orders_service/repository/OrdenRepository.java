package com.dispenser.orders_service.repository;

import com.dispenser.orders_service.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdenRepository extends JpaRepository<Orden, Long> {
    List<Orden> findByIdCliente(Long idCliente);
}