package com.dispenser.shipments_service.service;

import com.dispenser.shipments_service.model.Shipment;
import com.dispenser.shipments_service.repository.ShipmentRepository;
import org.springframework.stereotype.Service;

@Service
public class ShipmentService {
    private final ShipmentRepository shipmentRepository;

    public ShipmentService(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    public Shipment updateStatus(Long orderId, String status) {
        Shipment shipment = shipmentRepository.findById(orderId)
                .orElseGet(() -> {
                    Shipment newShipment = new Shipment();
                    newShipment.setOrderId(orderId);
                    return newShipment;
                });
        shipment.setStatus(status);
        return shipmentRepository.save(shipment);
    }

    public Shipment getShipment(Long orderId) {
        return shipmentRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Shipment not found for orderId: " + orderId));
    }
}