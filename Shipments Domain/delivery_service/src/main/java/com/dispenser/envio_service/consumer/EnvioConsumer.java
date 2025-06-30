package com.dispenser.envio_service.consumer;

import com.dispenser.envio_service.model.Envio;
import com.dispenser.envio_service.service.EnvioService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class EnvioConsumer {
    @Autowired
    private EnvioService envioService;

    @RabbitListener(queues = "envio.process.queue")
    public void processDispatchUpdated(String message) {
        String[] parts = message.split(",");
        Long idDespacho = Long.parseLong(parts[0]);
        Long idOrden = Long.parseLong(parts[1]);

        // Simulación: Obtener datos del despacho (en producción, consulta a dispatch-service)
        Envio envio = new Envio();
        envio.setIdDespacho(idDespacho);
        envio.setFechaDespacho(LocalDateTime.now()); // Para simulación, usa la fecha actual
        envio.setEstado("en preparación");
        envio.setCorreoUsuario("usuario@example.com"); // Placeholder, debería venir del cliente

        envioService.save(envio);

        // Simulación de envío si la fecha coincide
        if (LocalDateTime.now().isEqual(envio.getFechaDespacho()) || LocalDateTime.now().isAfter(envio.getFechaDespacho())) {
            envio.setEstado("entregado");
            envioService.save(envio);
            System.out.println("Simulación de envío: Correo enviado a " + envio.getCorreoUsuario());
        }
    }
}