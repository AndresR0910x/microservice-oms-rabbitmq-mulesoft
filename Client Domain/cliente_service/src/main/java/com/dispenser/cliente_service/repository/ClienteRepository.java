package com.dispenser.cliente_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dispenser.cliente_service.model.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}