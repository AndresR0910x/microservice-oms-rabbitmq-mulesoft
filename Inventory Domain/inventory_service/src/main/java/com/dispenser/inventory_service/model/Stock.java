package com.dispenser.inventory_service.model;

import jakarta.persistence.*;

@Entity
@Table(name = "stock")
public class Stock {
    @Id
    private String productoId;

    private Integer cantidad;

    // Getters y Setters
    public String getProductoId() { return productoId; }
    public void setProductoId(String productoId) { this.productoId = productoId; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
}