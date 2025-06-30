package com.dispenser.dispatch_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrdenProductoDTO {
    private Long idOrden;
    private Long idProducto;
    private Integer cantidad;
}