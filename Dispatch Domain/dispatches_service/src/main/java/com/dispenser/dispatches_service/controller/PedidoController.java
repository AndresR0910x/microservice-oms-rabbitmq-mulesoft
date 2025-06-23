package com.dispenser.dispatches_service.controller;

import com.dispenser.dispatches_service.model.*;
import com.dispenser.dispatches_service.services.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/despacho")
public class PedidoController {
    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PutMapping("/{ordenId}/estado")
    public ResponseEntity<Dispatch> cambiarEstado(@PathVariable Long ordenId, @RequestBody String estado) {
        return ResponseEntity.ok(pedidoService.cambiarEstado(ordenId, estado));
    }

    @PutMapping("/{ordenId}/listo")
    public ResponseEntity<Dispatch> marcarListoParaEnvio(@PathVariable Long ordenId) {
        return ResponseEntity.ok(pedidoService.marcarListoParaEnvio(ordenId));
    }
}