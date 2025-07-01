package com.dispenser.envio_service.dto;

import lombok.Data;

@Data
public class OrdenProductoDTO {
    private Long idOrdenProducto;
    private Long idProducto;
    private Integer cantidad;
}