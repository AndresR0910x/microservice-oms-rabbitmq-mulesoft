package com.dispenser.cobro_service.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClienteDTO {
    private Long idCliente; // Adaptado de id_cliente para seguir la convención de nombres
    private String nombre;
    private String direccion;
    private String contacto;
}