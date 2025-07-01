package com.dispenser.product.controller;

import com.dispenser.product.model.Producto;
import com.dispenser.product.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // -----------------------------
    // CRUD Productos
    // -----------------------------

    @PostMapping
    public Producto crearProducto(@RequestBody Producto producto) {
        return productoService.crearProducto(producto);
    }

    @GetMapping
    public List<Producto> obtenerTodosLosProductos() {
        return productoService.obtenerTodosLosProductos();
    }

    @GetMapping("/{id}")
    public Producto obtenerProductoPorId(@PathVariable Long id) {
        return productoService.obtenerProductoPorId(id);
    }

    @PutMapping("/{id}")
    public Producto actualizarProducto(@PathVariable Long id, @RequestBody Producto productoDetalles) {
        return productoService.actualizarProducto(id, productoDetalles);
    }

    // -----------------------------
    // Subida de imágenes
    // -----------------------------

    private final String uploadDir = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> subirImagen(@RequestParam("file") MultipartFile file) {
        try {
            String nombreArchivo = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path rutaArchivo = Paths.get(uploadDir, nombreArchivo);

            Files.createDirectories(rutaArchivo.getParent());
            Files.copy(file.getInputStream(), rutaArchivo, StandardCopyOption.REPLACE_EXISTING);

            String urlImagen = "http://localhost:8084/uploads/" + nombreArchivo;

            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("url", urlImagen);

            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al subir la imagen"));
        }
    }
}
