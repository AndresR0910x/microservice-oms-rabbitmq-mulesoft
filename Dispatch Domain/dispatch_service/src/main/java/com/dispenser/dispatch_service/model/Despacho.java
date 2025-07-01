package com.dispenser.dispatch_service.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "despacho")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Despacho {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_despacho")
    private Long idDespacho;

    @Column(name = "id_orden", nullable = false)
    private Long idOrden;

    private LocalDateTime fechaDespacho;
    private String estado; // Ejemplo: "pendiente", "enviado", "entregado"
    private String direccionEntrega;

    @Column(name = "total_envio")
    private Double totalEnvio; // Nuevo campo para el total del envío
}