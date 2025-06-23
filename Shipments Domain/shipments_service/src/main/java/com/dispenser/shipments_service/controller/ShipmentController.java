package com.dispenser.shipments_service.controller;

import com.dispenser.shipments_service.model.Shipment;
import com.dispenser.shipments_service.service.ShipmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {
    private final ShipmentService shipmentService;

    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Shipment> updateStatus(@PathVariable Long orderId, @RequestBody String status) {
        return ResponseEntity.ok(shipmentService.updateStatus(orderId, status));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Shipment> getShipment(@PathVariable Long orderId) {
        return ResponseEntity.ok(shipmentService.getShipment(orderId));
    }
}