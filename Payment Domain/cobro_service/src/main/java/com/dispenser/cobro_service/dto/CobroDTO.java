package com.dispenser.cobro_service.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CobroDTO {
    private Long idCobro;
    private Long idOrden;
    private Double monto;
    private String metodoPago;
    private LocalDateTime fechaCobro;
    private String estado;
    private String transaccionId;
    private Double costoEnvio;
    private String moneda;
    private Double montoTotal; // Agregado para soportar setMontoTotal en CobroService
}