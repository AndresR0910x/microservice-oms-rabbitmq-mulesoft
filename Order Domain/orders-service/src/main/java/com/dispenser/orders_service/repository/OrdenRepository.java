package com.dispenser.orders_service.repository;

import com.dispenser.orders_service.model.Orden;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdenRepository extends JpaRepository<Orden, Long> {

    List<Orden> findByIdCliente(Long idCliente);
}
