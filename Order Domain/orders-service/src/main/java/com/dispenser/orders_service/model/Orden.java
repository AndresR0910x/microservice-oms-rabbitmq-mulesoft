package com.dispenser.orders_service.model;

import com.dispenser.orders_service.dto.Cliente;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Cliente cliente;

    // Métodos getters adicionales para los campos que necesitas
    public Long getIdCliente() {
        return this.idCliente;
    }

    public String getFecha() {
        return this.fecha;
    }

    public String getEstado() {
        return this.estado;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
        if (cliente != null) {
            this.idCliente = cliente.getIdCliente();
        }
    }

    public void setFecha(String fecha) {
        this.fecha = fecha;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Cliente getCliente() {
        return this.cliente;
    }
}