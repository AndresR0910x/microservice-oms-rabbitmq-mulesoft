package com.dispenser.orders_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteDTO {
    @JsonProperty("id_cliente")
    private Long idCliente;
    private String nombre;
    private String direccion;
    private String contacto;

    @Override
    public String toString() {
        return "ClienteDTO{idCliente=" + idCliente + ", nombre='" + nombre + "', direccion='" + direccion + "', contacto='" + contacto + "'}";
    }
}