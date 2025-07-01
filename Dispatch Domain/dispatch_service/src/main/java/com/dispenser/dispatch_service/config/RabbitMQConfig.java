package com.dispenser.dispatch_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String COBRO_COMPLETED_EXCHANGE = "cobro.completed.exchange";
    public static final String COBRO_COMPLETED_ROUTING_KEY = "cobro.completed";
    public static final String DISPATCH_UPDATE_QUEUE = "dispatch.update.queue";

    public static final String ORDER_CREATED_EXCHANGE = "order.created.exchange";
    public static final String ORDER_CREATED_ROUTING_KEY = "order.created";
    public static final String ORDER_CREATED_QUEUE = "order.created.queue";

    public static final String DESPACHO_UPDATE_EXCHANGE = "despacho.update.exchange";
    public static final String DESPACHO_UPDATE_ROUTING_KEY = "despacho.update";
    public static final String DESPACHO_UPDATE_QUEUE = "despacho.update.queue";

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

    @Bean
    public DirectExchange orderCreatedExchange() {
        return new DirectExchange(ORDER_CREATED_EXCHANGE);
    }

    @Bean
    public Queue orderCreatedQueue() {
        return QueueBuilder.durable(ORDER_CREATED_QUEUE).build();
    }

    @Bean
    public Binding orderCreatedBinding(Queue orderCreatedQueue, DirectExchange orderCreatedExchange) {
        return BindingBuilder
                .bind(orderCreatedQueue)
                .to(orderCreatedExchange)
                .with(ORDER_CREATED_ROUTING_KEY);
    }

    @Bean
    public DirectExchange despachoUpdateExchange() {
        return new DirectExchange(DESPACHO_UPDATE_EXCHANGE);
    }

    @Bean
    public Queue despachoUpdateQueue() {
        return QueueBuilder.durable(DESPACHO_UPDATE_QUEUE)
                .autoDelete() // Opcional, si no quieres que persista
                .build();
    }

    @Bean
    public Binding despachoUpdateBinding(Queue despachoUpdateQueue, DirectExchange despachoUpdateExchange) {
        return BindingBuilder
                .bind(despachoUpdateQueue)
                .to(despachoUpdateExchange)
                .with(DESPACHO_UPDATE_ROUTING_KEY);
    }

    @Bean
    public RabbitAdmin rabbitAdmin(ConnectionFactory connectionFactory) {
        return new RabbitAdmin(connectionFactory);
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setExchange(DESPACHO_UPDATE_EXCHANGE); // Opcional, para pruebas
        return rabbitTemplate;
    }

    // Corrección: Devolver RabbitAdmin en lugar de void
    @Bean
    public RabbitAdmin initializeRabbitAdmin(RabbitAdmin rabbitAdmin) {
        rabbitAdmin.initialize();
        return rabbitAdmin;
    }
}