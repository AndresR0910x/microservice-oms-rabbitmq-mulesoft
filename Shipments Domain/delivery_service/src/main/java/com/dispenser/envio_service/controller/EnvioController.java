package com.dispenser.envio_service.controller;

import com.dispenser.envio_service.model.Envio;
import com.dispenser.envio_service.service.EnvioService;
import com.dispenser.envio_service.dto.OrdenDTO;
import com.dispenser.envio_service.dto.ClienteDTO;
import com.dispenser.envio_service.dto.DespachoDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/envios")
public class EnvioController {

    private static final Logger logger = LoggerFactory.getLogger(EnvioController.class);

    @Autowired
    private EnvioService envioService;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    private final String ORDERS_SERVICE_URL = "http://localhost:8081/api/ordenes/";
    private final String DESPACHO_SERVICE_URL = "http://localhost:8085/api/despachos/obtenerPorIdOrden";

    @PostMapping
    public ResponseEntity<Envio> crearEnvio(@RequestParam Long idOrden) {
        // Obtener la orden y la dirección del cliente
        OrdenDTO orden = restTemplate.getForObject(ORDERS_SERVICE_URL + idOrden, OrdenDTO.class);
        if (orden == null || orden.getCliente() == null) {
            throw new RuntimeException("Orden o cliente no encontrado con ID: " + idOrden);
        }
        ClienteDTO cliente = orden.getCliente();
        String direccionEntrega = cliente.getDireccion();
        String correoUsuario = cliente.getContacto();

        // Obtener el despacho existente
        DespachoDTO despacho = restTemplate.getForObject(DESPACHO_SERVICE_URL + "?idOrden=" + idOrden, DespachoDTO.class);
        if (despacho == null) {
            throw new RuntimeException("Despacho no encontrado para idOrden: " + idOrden);
        }
        Long idDespacho = despacho.getIdDespacho();

        // Crear el envío
        Envio envio = new Envio();
        envio.setIdDespacho(idDespacho);
        envio.setIdOrden(idOrden);
        envio.setFechaDespacho(LocalDateTime.now()); // Fecha actual de creación
        envio.setEstado("enviada"); // Estado final
        envio.setDireccionEntrega(direccionEntrega);
        envio.setCorreoUsuario(correoUsuario);
        Envio savedEnvio = envioService.save(envio);
        logger.info("Envío creado para idOrden {}: {}", idOrden, savedEnvio);

        // Actualizar el despacho
        actualizarDespacho(savedEnvio);

        return ResponseEntity.ok(savedEnvio);
    }

    @GetMapping("/{idEnvio}")
    public ResponseEntity<Envio> obtenerEnvio(@PathVariable Long idEnvio) {
        Envio envio = envioService.findById(idEnvio)
                .orElseThrow(() -> new RuntimeException("Envío no encontrado con ID: " + idEnvio));
        return ResponseEntity.ok(envio);
    }

    private void actualizarDespacho(Envio envio) {
        if (envio.getIdDespacho() == null) {
            logger.warn("No se puede actualizar el despacho: idDespacho es null");
            return;
        }
        String updateMessage = String.format("idDespacho=%d,estado=enviada,fechaDespacho=%s",
                envio.getIdDespacho(), envio.getFechaDespacho());
        rabbitTemplate.convertAndSend("despacho.update.exchange", "despacho.update", updateMessage);
        logger.info("Mensaje enviado a despacho-service: {}", updateMessage);

        // Enviar correo simulado
        enviarCorreo(envio);
    }

    private void enviarCorreo(Envio envio) {
        String subject = "Detalles de tu envío - Orden #" + envio.getIdOrden();
        String body = String.format(
                "Hola,\n\nTu orden #%d ha sido enviada.\n" +
                "Detalles del envío:\n" +
                "- Fecha de despacho: %s\n" +
                "- Estado: %s\n" +
                "- Dirección de entrega: %s\n" +
                "- Correo de contacto: %s\n\n" +
                "¡Gracias por tu compra!",
                envio.getIdOrden(), envio.getFechaDespacho(), envio.getEstado(),
                envio.getDireccionEntrega(), envio.getCorreoUsuario());
        logger.info("Correo simulado enviado a {} - Asunto: {}, Cuerpo: {}", envio.getCorreoUsuario(), subject, body);
    }
}