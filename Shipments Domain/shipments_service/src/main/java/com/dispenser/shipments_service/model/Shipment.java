package com.dispenser.shipments_service.model;

import jakarta.persistence.*;

@Entity
@Table(name = "shipments")
public class Shipment {
    @Id
    private Long orderId;

    private String status; // Example: PREPARED, IN_TRANSIT, DELIVERED

    // Getters and Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}