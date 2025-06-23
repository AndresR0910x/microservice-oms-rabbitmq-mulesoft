package com.dispenser.payment_service.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    @Id
    private Long orderId;

    private String status; // Example: PENDING, SUCCESS, FAILURE
    private LocalDateTime processingDate;

    // Getters and Setters
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getProcessingDate() { return processingDate; }
    public void setProcessingDate(LocalDateTime processingDate) { this.processingDate = processingDate; }
}