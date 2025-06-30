package com.dispenser.dispatch_service.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Nombre del exchange
    public static final String COBRO_COMPLETED_EXCHANGE = "cobro.completed.exchange";
    public static final String COBRO_COMPLETED_ROUTING_KEY = "cobro.completed";
    public static final String DISPATCH_UPDATE_QUEUE = "dispatch.update.queue";

    @Bean
    public DirectExchange cobroCompletedExchange() {
        return new DirectExchange(COBRO_COMPLETED_EXCHANGE);
    }

    @Bean
    public Queue dispatchUpdateQueue() {
        return QueueBuilder.durable(DISPATCH_UPDATE_QUEUE).build();
    }

    @Bean
    public Binding dispatchUpdateBinding(Queue dispatchUpdateQueue, DirectExchange cobroCompletedExchange) {
        return BindingBuilder
                .bind(dispatchUpdateQueue)
                .to(cobroCompletedExchange)
                .with(COBRO_COMPLETED_ROUTING_KEY);
    }
}