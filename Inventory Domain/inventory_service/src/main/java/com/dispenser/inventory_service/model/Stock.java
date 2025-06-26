package com.dispenser.inventory_service.model;

import jakarta.persistence.*;

@Entity
@Table(name = "stock")
public class Stock {
    @Id
    private Long itemId;

    private Integer quantity;

    // Getters and Setters
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}