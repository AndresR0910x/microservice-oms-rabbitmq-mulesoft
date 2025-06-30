package com.dispenser.cobro_service.repository;

import com.dispenser.cobro_service.model.Cobro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CobroRepository extends JpaRepository<Cobro, Long> {
}