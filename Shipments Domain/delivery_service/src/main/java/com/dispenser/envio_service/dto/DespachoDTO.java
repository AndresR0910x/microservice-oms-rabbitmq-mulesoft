package com.dispenser.envio_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DespachoDTO {
    private Long idDespacho;
    private Long idOrden;
    private LocalDateTime fechaDespacho;
    private String estado;
    private String direccionEntrega;
}