package com.dispenser.envio_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ClienteDTO {
    @JsonProperty("id_cliente")
    private Long idCliente; // Mapea 'id_cliente' del JSON
    private String nombre;
    private String direccion;
    private String contacto; // Correo electrónico
}