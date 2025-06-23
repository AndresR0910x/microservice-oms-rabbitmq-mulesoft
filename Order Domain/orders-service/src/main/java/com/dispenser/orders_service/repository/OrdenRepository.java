package com.dispenser.orders_service.repository;

import com.dispenser.orders_service.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdenRepository extends JpaRepository<Order, Long> {
}