package com.dispenser.inventory_service.repository;

import com.dispenser.inventory_service.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, String> {
}