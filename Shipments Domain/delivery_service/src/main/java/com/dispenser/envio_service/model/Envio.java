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

    private LocalDateTime fechaDespacho;
    private String estado; // Ejemplo: "en preparación", "en tránsito", "entregado"
    private String correoUsuario;
}