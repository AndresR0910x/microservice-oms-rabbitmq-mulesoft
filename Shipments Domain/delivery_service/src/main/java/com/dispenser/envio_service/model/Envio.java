package com.dispenser.envio_service.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "envio")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Envio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_envio")
    private Long idEnvio;

    @Column(name = "id_despacho")
    private Long idDespacho;

    @Column(name = "id_orden")
    private Long idOrden;

    @Column(name = "fecha_despacho")
    private LocalDateTime fechaDespacho;

    @Column(name = "estado")
    private String estado; // "en preparación", "en tránsito", "enviada", "entregado"

    @Column(name = "direccion_entrega")
    private String direccionEntrega;

    @Column(name = "correo_usuario")
    private String correoUsuario;
}