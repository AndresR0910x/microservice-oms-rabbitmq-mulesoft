package com.dispenser.cobro_service.controller;

import com.dispenser.cobro_service.dto.CobroDTO;
import com.dispenser.cobro_service.model.*;
import com.dispenser.cobro_service.service.CobroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cobros")
public class CobroController {
    @Autowired
    private CobroService cobroService;

    @PostMapping
    public ResponseEntity<CobroDTO> crearCobro(@RequestBody CobroDTO cobroDTO) {
        Cobro cobro = cobroService.crearCobro(cobroDTO.getIdOrden(), cobroDTO.getMonto(), cobroDTO.getMetodoPago());
        CobroDTO responseDto = convertToDTO(cobro);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/{idCobro}")
    public ResponseEntity<CobroDTO> obtenerCobro(@PathVariable Long idCobro) {
        Cobro cobro = cobroService.obtenerCobroPorId(idCobro);
        CobroDTO dto = convertToDTO(cobro);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{idCobro}/actualizar")
    public ResponseEntity<CobroDTO> actualizarCobro(@PathVariable Long idCobro, @RequestBody CobroDTO cobroDTO) {
        Cobro cobro = cobroService.actualizarCobro(idCobro, cobroDTO.getCostoEnvio());
        CobroDTO responseDto = convertToDTO(cobro);
        return ResponseEntity.ok(responseDto);
    }

    private CobroDTO convertToDTO(Cobro cobro) {
        CobroDTO dto = new CobroDTO();
        dto.setIdCobro(cobro.getIdCobro());
        dto.setIdOrden(cobro.getIdOrden());
        dto.setMonto(cobro.getMonto());
        dto.setMetodoPago(cobro.getMetodoPago());
        dto.setFechaCobro(cobro.getFechaCobro());
        dto.setEstado(cobro.getEstado());
        dto.setTransaccionId(cobro.getTransaccionId());
        dto.setCostoEnvio(cobro.getCostoEnvio());
        dto.setMoneda(cobro.getMoneda());
        return dto;
    }
}