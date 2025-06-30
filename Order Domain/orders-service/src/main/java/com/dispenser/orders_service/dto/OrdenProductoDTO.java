package com.dispenser.orders_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrdenProductoDTO {
    private Long idOrden;
    private Long idProducto;
    private Integer cantidad;

    // Métodos explícitos para asegurar compatibilidad
    public Long getIdOrden() {
        return idOrden;
    }

    public void setIdOrden(Long idOrden) {
        this.idOrden = idOrden;
    }

    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}