package com.dispenser.cobro_service.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class OrdenDTO {
    private Long idOrden;
    private ClienteDTO cliente; // Cambiado de idCliente a cliente para soportar getCliente()
    private String fecha;
    private String estado;
    private Set<OrdenProductoDTO> orderProducts; // Cambiado de orderProductos a orderProducts para getOrderProducts()
}