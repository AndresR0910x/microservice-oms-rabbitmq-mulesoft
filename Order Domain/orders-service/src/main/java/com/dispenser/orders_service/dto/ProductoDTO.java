package com.dispenser.orders_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductoDTO {
    private Long idProducto;
    private String nombre;
    private String precio;
    private Integer stock;
    private String estado;
}