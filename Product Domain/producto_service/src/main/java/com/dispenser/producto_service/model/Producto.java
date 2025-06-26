package com.dispenser.producto_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Producto {
    @Id
    private Long id_producto;
    private String nombre;
    private Double precio;
    private Integer stock;

    @OneToMany(mappedBy = "producto")
    private List<Inventario> inventarios;
}

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
class Inventario {
    private Long id_inventario;
    private Long id_producto;
    private Integer cantidad;
}