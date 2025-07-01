package com.dispenser.envio_service.consumer;

import com.dispenser.envio_service.model.Envio;
import com.dispenser.envio_service.service.EnvioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class EnvioConsumer {

    private static final Logger logger = LoggerFactory.getLogger(EnvioConsumer.class);

    @Autowired
    private EnvioService envioService;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @RabbitListener(queues = "envio.process.queue")
    public void processDispatchUpdated(String message) {
        logger.info("Mensaje recibido en EnvioConsumer: {}", message);

        try {
            // Parsear el mensaje (idDespacho,idOrden,direccionEntrega,correoUsuario)
            String[] parts = message.split(",");
            if (parts.length < 4) {
                throw new IllegalArgumentException("Mensaje inválido: se requieren idDespacho, idOrden, direccionEntrega y correoUsuario");
            }

            Long idDespacho = Long.parseLong(parts[0].trim()); // idDespacho
            Long idOrden = Long.parseLong(parts[1].trim());    // idOrden
            String direccionEntrega = parts[2].trim();         // direccionEntrega
            String correoUsuario = parts[3].trim();            // correoUsuario

            // Crear y guardar el envío
            Envio envio = new Envio();
            envio.setIdDespacho(idDespacho);
            envio.setIdOrden(idOrden);
            envio.setFechaDespacho(LocalDateTime.now());
            envio.setEstado("en preparación");
            envio.setDireccionEntrega(direccionEntrega);
            envio.setCorreoUsuario(correoUsuario);
            Envio savedEnvio = envioService.save(envio);
            logger.info("Envío creado para idDespacho {}: {}", idDespacho, savedEnvio);

            // Simular envío (puedes reemplazar esto con lógica real)
            if (LocalDateTime.now().isEqual(savedEnvio.getFechaDespacho()) || LocalDateTime.now().isAfter(savedEnvio.getFechaDespacho())) {
                savedEnvio.setEstado("enviada");
                savedEnvio.setFechaDespacho(LocalDateTime.now()); // Actualizar con la fecha real de envío
                envioService.save(savedEnvio);
                logger.info("Envío procesado para idDespacho {}: Estado = enviada", idDespacho);

                // Enviar mensaje a despacho-service para actualizar
                String updateMessage = String.format("idDespacho=%d,estado=enviada,fechaDespacho=%s",
                        idDespacho, savedEnvio.getFechaDespacho());
                rabbitTemplate.convertAndSend("despacho.update.exchange", "despacho.update", updateMessage);
                logger.info("Mensaje enviado a despacho-service: {}", updateMessage);

                // Enviar correo (placeholder, reemplazar con EmailService)
                enviarCorreo(savedEnvio);
            }
        } catch (Exception e) {
            logger.error("Error al procesar mensaje de envío: {}", e.getMessage(), e);
        }
    }

    private void enviarCorreo(Envio envio) {
        // Placeholder para envío de correo
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
        // Aquí deberías integrar un servicio de correo (ej. JavaMailSender)
    }
}