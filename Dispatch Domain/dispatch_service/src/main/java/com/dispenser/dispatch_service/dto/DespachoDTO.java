package com.dispenser.dispatch_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DespachoDTO {
    private Long idDespacho;
    private Long idOrden;
    private String fechaDespacho;
    private String estado;
    private String direccionEntrega;
}