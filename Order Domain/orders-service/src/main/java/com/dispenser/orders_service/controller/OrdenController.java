package com.dispenser.orders_service.controller;

import com.dispenser.orders_service.model.Orden;
import com.dispenser.orders_service.service.OrdenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {
    @Autowired
    private OrdenService ordenService;

    @PostMapping
    public Orden crearOrden(@RequestBody Orden orden) {
        return ordenService.crearOrden(orden);
    }

    @GetMapping
    public List<Orden> obtenerTodasLasOrdenes() {
        return ordenService.obtenerTodasLasOrdenes();
    }

    @GetMapping("/{id}")
    public Orden obtenerOrdenPorId(@PathVariable Long id) {
        return ordenService.obtenerOrdenPorId(id);
    }

    @PutMapping("/{id}")
    public Orden actualizarOrden(@PathVariable Long id, @RequestBody Orden ordenDetalles) {
        return ordenService.actualizarOrden(id, ordenDetalles);
    }

    @GetMapping("/cliente/{idCliente}")
    public List<Orden> obtenerOrdenesPorCliente(@PathVariable Long idCliente) {
        return ordenService.obtenerOrdenesPorCliente(idCliente);
    }

    @DeleteMapping("/{id}")
    public void eliminarOrden(@PathVariable Long id) {
        ordenService.eliminarOrden(id);
    }

    @GetMapping("/estado/{estado}")
    public List<Orden> obtenerOrdenesPorEstado(@PathVariable String estado) {
        return ordenService.obtenerOrdenesPorEstado(estado);
    }

    @GetMapping("/cliente/{idCliente}/count")
    public Long contarOrdenesPorCliente(@PathVariable Long idCliente) {
        return ordenService.contarOrdenesPorCliente(idCliente);
    }
}