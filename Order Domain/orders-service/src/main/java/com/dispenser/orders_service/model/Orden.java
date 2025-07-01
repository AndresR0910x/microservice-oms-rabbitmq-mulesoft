package com.dispenser.orders_service.model;

import com.dispenser.orders_service.dto.ClienteDTO;
import com.dispenser.orders_service.dto.OrdenProductoDTO;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orden")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Orden {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden")
    private Long idOrden;

    private String fecha;
    private String estado;

    @Column(name = "id_cliente")
    private Long idCliente;

    @Transient
    private ClienteDTO cliente;

    @Transient
    private Set<OrdenProductoDTO> productos = new HashSet<>();

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<OrdenProducto> orderProducts = new HashSet<>();

    // Métodos existentes...
    public Long getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(Long idCliente) {
        this.idCliente = idCliente;
    }

    public void setCliente(ClienteDTO cliente) {
        this.cliente = cliente;
    }

    public Set<OrdenProductoDTO> getProductos() {
        return productos;
    }

    public void setProductos(Set<OrdenProductoDTO> productos) {
        this.productos = productos;
    }

    public Set<OrdenProducto> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(Set<OrdenProducto> orderProducts) {
        this.orderProducts = orderProducts;
    }

    public void addProducto(OrdenProducto ordenProducto) {
        if (ordenProducto != null) {
            ordenProducto.setOrden(this);
            orderProducts.add(ordenProducto);
        }
    }

    public void removeProducto(Long productoId) {
        orderProducts.removeIf(op -> op != null && op.getIdProducto() != null && op.getIdProducto().equals(productoId));
    }

    public void updateProductIds() {
        // No necesario con la relación establecida
    }

    public Orden orElseThrow(Object object) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'orElseThrow'");
    }
}