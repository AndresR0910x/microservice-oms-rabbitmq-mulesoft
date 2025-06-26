package com.dispenser.orders_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cliente {
    @JsonProperty("id_cliente")
    private Long idCliente;
    private String nombre;
    private String direccion;
    private String contacto;

    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    @Override
    public String toString() {
        return "Cliente{idCliente=" + idCliente + ", nombre='" + nombre + "', direccion='" + direccion + "', contacto='" + contacto + "'}";
    }
}