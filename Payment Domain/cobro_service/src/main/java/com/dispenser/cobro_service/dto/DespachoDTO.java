package com.dispenser.cobro_service.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class DespachoDTO {
    private Long idDespacho;
    private Long idOrden;
    private LocalDateTime fechaDespacho;
    private String estado;
    private String direccionEntrega;
}