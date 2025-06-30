package com.dispenser.orders_service.model;

import com.dispenser.orders_service.dto.ClienteDTO;
import com.dispenser.orders_service.dto.OrdenProductoDTO;
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

    // Métodos explícitos
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

    public void addProducto(OrdenProductoDTO ordenProductoDTO) {
        if (ordenProductoDTO != null) {
            if (this.idOrden != null && ordenProductoDTO.getIdOrden() == null) {
                ordenProductoDTO.setIdOrden(this.idOrden);
            }
            productos.add(ordenProductoDTO);
        }
    }

    public void removeProducto(Long productoId) {
        productos.removeIf(op -> op != null && op.getIdProducto() != null && op.getIdProducto().equals(productoId));
    }

    // Método para actualizar idOrden en productos después de guardar
    public void updateProductIds() {
        if (idOrden != null) {
            for (OrdenProductoDTO op : productos) {
                if (op.getIdOrden() == null) {
                    op.setIdOrden(idOrden);
                }
            }
        }
    }
}