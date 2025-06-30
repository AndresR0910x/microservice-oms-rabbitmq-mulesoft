package com.dispenser.dispatch_service.controller;

import com.dispenser.dispatch_service.dto.DespachoDTO;
import com.dispenser.dispatch_service.model.*;
import com.dispenser.dispatch_service.service.DespachoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/despachos")
public class DespachoController {
    @Autowired
    private DespachoService despachoService;

    @PostMapping
    public ResponseEntity<DespachoDTO> crearDespacho(@RequestParam Long idOrden) {
        Despacho despacho = despachoService.crearDespacho(idOrden);
        DespachoDTO dto = convertToDTO(despacho);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{idDespacho}")
    public ResponseEntity<DespachoDTO> obtenerDespacho(@PathVariable Long idDespacho) {
        Despacho despacho = despachoService.obtenerDespachoPorId(idDespacho);
        DespachoDTO dto = convertToDTO(despacho);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/agendar/{idDespacho}")
    public ResponseEntity<DespachoDTO> agendarDespacho(
            @PathVariable Long idDespacho,
            @RequestBody DespachoDTO despachoDTO) {
        Despacho despacho = despachoService.agendarDespacho(idDespacho, despachoDTO.getFechaDespacho(), despachoDTO.getEstado(), despachoDTO.getDireccionEntrega());
        DespachoDTO responseDto = convertToDTO(despacho);
        return ResponseEntity.ok(responseDto);
    }

    private DespachoDTO convertToDTO(Despacho despacho) {
        DespachoDTO dto = new DespachoDTO();
        dto.setIdDespacho(despacho.getIdDespacho());
        dto.setIdOrden(despacho.getIdOrden());
        dto.setFechaDespacho(despacho.getFechaDespacho());
        dto.setEstado(despacho.getEstado());
        dto.setDireccionEntrega(despacho.getDireccionEntrega());
        return dto;
    }
}