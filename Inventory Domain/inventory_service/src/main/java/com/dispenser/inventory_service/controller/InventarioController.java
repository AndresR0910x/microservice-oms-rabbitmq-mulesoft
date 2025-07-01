package com.dispenser.inventory_service.controller;

import com.dispenser.inventory_service.model.Inventario;
import com.dispenser.inventory_service.repository.InventarioRepository;
import com.dispenser.inventory_service.service.InventarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventario")
public class InventarioController {

    @Autowired
    private InventarioService inventarioService;

    @Autowired
    private InventarioRepository inventarioRepository;

    // GET - Obtener todos los inventarios
    @GetMapping
    public List<Inventario> obtenerTodos() {
        return inventarioRepository.findAll();
    }

    // GET - Obtener inventario por ID
    @GetMapping("/{id}")
    public ResponseEntity<Inventario> obtenerPorId(@PathVariable Long id) {
        Inventario inventario = inventarioService.obtenerInventarioPorId(id);
        return ResponseEntity.ok(inventario);
    }

    // POST - Crear inventario
    @PostMapping
    public ResponseEntity<Inventario> crearInventario(@RequestParam Long idProducto,
                                                      @RequestParam(required = false) Integer stockInicial) {
        Inventario nuevoInventario = inventarioService.crearInventarioParaProducto(idProducto, stockInicial);
        return ResponseEntity.ok(nuevoInventario);
    }

    // PUT - Actualizar inventario
    @PutMapping("/{id}")
    public ResponseEntity<Inventario> actualizarInventario(@PathVariable Long id,
                                                           @RequestParam(required = false) Integer stockActual,
                                                           @RequestParam(required = false) Integer stockMinimo) {
        Inventario actualizado = inventarioService.actualizarInventario(id, stockActual, stockMinimo);
        return ResponseEntity.ok(actualizado);
    }

    // DELETE - Eliminar inventario
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarInventario(@PathVariable Long id) {
        if (!inventarioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        inventarioRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
