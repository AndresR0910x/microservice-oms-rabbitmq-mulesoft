package com.dispenser.dispatch_service.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class OrdenDTO {
    private Long idOrden;
    private Long idCliente;
    private String fecha;
    private String estado;
    private Set<OrdenProductoDTO> productos;
}