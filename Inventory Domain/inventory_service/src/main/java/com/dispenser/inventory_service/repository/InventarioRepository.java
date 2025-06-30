package com.dispenser.inventory_service.repository;

import com.dispenser.inventory_service.model.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventarioRepository extends JpaRepository<Inventario, Long> {
}