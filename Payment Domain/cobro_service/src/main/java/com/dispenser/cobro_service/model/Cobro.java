package com.dispenser.cobro_service.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "cobro")
@Getter
@Setter
public class Cobro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cobro")
    private Long idCobro;

    @Column(name = "id_orden", nullable = false)
    private Long idOrden;

    @Column(name = "monto", nullable = false)
    private Double monto;

    @Column(name = "metodo_pago")
    private String metodoPago;

    @Column(name = "fecha_cobro")
    private LocalDateTime fechaCobro;

    @Column(name = "estado")
    private String estado;

    @Column(name = "transaccion_id")
    private String transaccionId;

    @Column(name = "costo_envio")
    private Double costoEnvio;

    @Column(name = "moneda")
    private String moneda;

    @Column(name = "monto_total")
    private Double montoTotal; // Nueva columna

    // Constructores, getters y setters (generados por Lombok)
}