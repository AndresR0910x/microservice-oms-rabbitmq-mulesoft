package com.dispenser.cobro_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrdenProductoDTO {
    private Long idOrdenProducto;
    private Long idOrden; // Cambiado de OrdenDTO a Long para evitar referencia cíclica
    private Long idProducto;
    private Integer cantidad;
}