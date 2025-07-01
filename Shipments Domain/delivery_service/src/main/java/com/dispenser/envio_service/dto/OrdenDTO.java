package com.dispenser.envio_service.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class OrdenDTO {
    private Long idOrden;
    private LocalDate fecha; // Ajustado a LocalDate
    private String estado;
    private Long idCliente;
    private ClienteDTO cliente;
    private List<OrdenProductoDTO> orderProducts; // Cambiado a List para flexibilidad
    // Ignoramos 'productos' por ahora, pero puedes añadirlo si es necesario
    // private List<ProductoDTO> productos; // Opcional
}