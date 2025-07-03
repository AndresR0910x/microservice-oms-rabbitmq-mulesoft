package com.dispenser.orders_service.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String ORDER_CREATED_EXCHANGE = "order.created.exchange";
    public static final String ORDER_CREATED_ROUTING_KEY = "order.created";
    public static final String ORDER_CREATED_QUEUE = "order.created.queue";

    public static final String ORDER_PRODUCTS_EXCHANGE = "order.products.exchange";
    public static final String ORDER_PRODUCTS_ROUTING_KEY = "order.products";
    public static final String ORDER_PRODUCTS_QUEUE = "order.products.queue";

    public static final String COBRO_COMPLETED_EXCHANGE = "cobro.completed.exchange";
    public static final String COBRO_COMPLETED_ROUTING_KEY = "cobro.completed";
    public static final String COBRO_COMPLETED_QUEUE = "cobro.completed.queue";

    public static final String ORDER_UPDATE_EXCHANGE = "order.update.exchange";
    public static final String ORDER_UPDATE_ROUTING_KEY = "order.update";
    public static final String ORDER_UPDATE_QUEUE = "order.update.queue";

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
    public DirectExchange orderProductsExchange() {
        return new DirectExchange(ORDER_PRODUCTS_EXCHANGE);
    }

    @Bean
    public Queue orderProductsQueue() {
        return QueueBuilder.durable(ORDER_PRODUCTS_QUEUE).build();
    }

    @Bean
    public Binding orderProductsBinding(Queue orderProductsQueue, DirectExchange orderProductsExchange) {
        return BindingBuilder
                .bind(orderProductsQueue)
                .to(orderProductsExchange)
                .with(ORDER_PRODUCTS_ROUTING_KEY);
    }

    @Bean
    public DirectExchange cobroCompletedExchange() {
        return new DirectExchange(COBRO_COMPLETED_EXCHANGE);
    }

    @Bean
    public Queue cobroCompletedQueue() {
        return QueueBuilder.durable(COBRO_COMPLETED_QUEUE).build();
    }

    @Bean
    public Binding cobroCompletedBinding(Queue cobroCompletedQueue, DirectExchange cobroCompletedExchange) {
        return BindingBuilder
                .bind(cobroCompletedQueue)
                .to(cobroCompletedExchange)
                .with(COBRO_COMPLETED_ROUTING_KEY);
    }

    @Bean
    public DirectExchange orderUpdateExchange() {
        return new DirectExchange(ORDER_UPDATE_EXCHANGE);
    }

    @Bean
    public Queue orderUpdateQueue() {
        return QueueBuilder.durable(ORDER_UPDATE_QUEUE).build();
    }

    @Bean
    public Binding orderUpdateBinding(Queue orderUpdateQueue, DirectExchange orderUpdateExchange) {
        return BindingBuilder
                .bind(orderUpdateQueue)
                .to(orderUpdateExchange)
                .with(ORDER_UPDATE_ROUTING_KEY);
    }
}