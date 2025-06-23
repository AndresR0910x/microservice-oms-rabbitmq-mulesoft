package com.dispenser.dispatches_service.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pedidos")
public class Dispatch {
    @Id
    private Long ordenId;

    private String estado; // Ejemplo: EN_PROCESO, LISTO_PARA_ENVIO, ENVIADO

    // Getters y Setters
    public Long getOrdenId() { return ordenId; }
    public void setOrdenId(Long ordenId) { this.ordenId = ordenId; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}