package com.dispenser.orders_service.controller;

import com.dispenser.orders_service.model.Order;
import com.dispenser.orders_service.service.OrdenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenController {
    private final OrdenService ordenService;

    public OrdenController(OrdenService ordenService) {
        this.ordenService = ordenService;
    }

    @PostMapping
    public ResponseEntity<Order> crearOrden(@RequestBody Order orden) {
        return ResponseEntity.ok(ordenService.crearOrden(orden));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Order> actualizarEstado(@PathVariable Long id, @RequestBody String estado) {
        return ResponseEntity.ok(ordenService.actualizarEstado(id, estado));
    }
}