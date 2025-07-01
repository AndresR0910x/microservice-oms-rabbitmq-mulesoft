package com.dispenser.cobro_service.dto;



import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrdenProductoDTO {
    private Long idOrdenProducto;
    private OrdenDTO orden;
    private Long idProducto;
    private Integer cantidad;
}