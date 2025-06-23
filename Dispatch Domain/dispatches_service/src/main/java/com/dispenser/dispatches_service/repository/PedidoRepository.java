package com.dispenser.dispatches_service.repository;

import com.dispenser.dispatches_service.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Dispatch, Long> {
}