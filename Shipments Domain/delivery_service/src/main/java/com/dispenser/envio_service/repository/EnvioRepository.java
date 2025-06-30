package com.dispenser.envio_service.repository;

import com.dispenser.envio_service.model.Envio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnvioRepository extends JpaRepository<Envio, Long> {
}