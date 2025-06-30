package com.dispenser.inventory_service.service;

import com.dispenser.inventory_service.model.Inventario;
import com.dispenser.inventory_service.repository.InventarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InventarioService {
    @Autowired
    private InventarioRepository inventarioRepository;

    public Inventario crearInventarioParaProducto(Long idProducto, Integer stockInicial) {
        Inventario inventario = new Inventario();
        inventario.setIdProducto(idProducto);
        inventario.setStockActual(stockInicial != null ? stockInicial : 0);
        inventario.setStockMinimo(5); // Valor por defecto
        return inventarioRepository.save(inventario);
    }

    public Inventario actualizarInventario(Long idInventario, Integer stockActual, Integer stockMinimo) {
        Inventario inventario = inventarioRepository.findById(idInventario)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado con ID: " + idInventario));
        if (stockActual != null) inventario.setStockActual(stockActual);
        if (stockMinimo != null) inventario.setStockMinimo(stockMinimo);
        return inventarioRepository.save(inventario);
    }

    public Inventario obtenerInventarioPorId(Long idInventario) {
        return inventarioRepository.findById(idInventario)
                .orElseThrow(() -> new RuntimeException("Inventario no encontrado con ID: " + idInventario));
    }
}