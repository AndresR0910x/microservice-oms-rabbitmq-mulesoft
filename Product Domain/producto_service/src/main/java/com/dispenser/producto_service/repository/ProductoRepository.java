package com.dispenser.producto_service.repository;

import com.dispenser.producto_service.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
