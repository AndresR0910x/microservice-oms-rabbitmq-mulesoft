package com.dispenser.inventory_service.controller;

import com.dispenser.inventory_service.model.Stock;
import com.dispenser.inventory_service.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventario")
public class StockController {
    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PutMapping("/{productoId}/disminuir")
    public ResponseEntity<Stock> disminuirStock(@PathVariable String productoId, @RequestBody int cantidad) {
        return ResponseEntity.ok(stockService.disminuirStock(productoId, cantidad));
    }

    @PutMapping("/{productoId}/liberar")
    public ResponseEntity<Stock> liberarStock(@PathVariable String productoId, @RequestBody int cantidad) {
        return ResponseEntity.ok(stockService.liberarStock(productoId, cantidad));
    }
}