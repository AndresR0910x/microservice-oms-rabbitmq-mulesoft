package com.dispenser.dispatch_service.repository;

import com.dispenser.dispatch_service.model.Despacho;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DespachoRepository extends JpaRepository<Despacho, Long> {
    Optional<Despacho> findByIdOrden(Long idOrden);
}