package com.dispenser.cobro_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cobro")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Cobro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cobro")
    private Long idCobro;

    @Column(name = "id_orden", nullable = false)
    private Long idOrden; // Clave foránea que vincula el cobro con la orden

    private Double monto; // Monto inicial del cobro (sin costo de envío)
    private String metodoPago; // Ejemplo: "tarjeta", "efectivo", "transferencia"
    private LocalDateTime fechaCobro; // Fecha y hora del cobro
    private String estado; // Ejemplo: "pendiente", "completado", "fallido"
    private String transaccionId; // ID de la transacción externa (opcional)
    private Double costoEnvio; // Campo para añadir el costo de envío más tarde
    private String moneda; // Ejemplo: "USD", "MXN" (para internacionalización)
}