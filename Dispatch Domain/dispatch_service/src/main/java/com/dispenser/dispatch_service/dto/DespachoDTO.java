package com.dispenser.dispatch_service.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DespachoDTO {
    private Long idDespacho;
    private Long idOrden;
    private LocalDateTime fechaDespacho;
    private String estado;
    private String direccionEntrega;
}