package com.dispenser.shipments_service.repository;

import com.dispenser.shipments_service.model.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
}