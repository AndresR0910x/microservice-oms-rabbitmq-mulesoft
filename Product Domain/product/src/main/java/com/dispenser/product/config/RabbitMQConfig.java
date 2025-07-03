package com.dispenser.product.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String PRODUCT_CREATED_QUEUE = "product.created.queue";
    public static final String PRODUCT_CREATED_EXCHANGE = "product.created.exchange";
    public static final String ROUTING_KEY = "product.created";

    public static final String ORDER_PRODUCTS_QUEUE = "order.products.queue";
    public static final String ORDER_PRODUCTS_EXCHANGE = "order.products.exchange";
    public static final String ORDER_PRODUCTS_ROUTING_KEY = "order.products";

    @Bean
    public Queue productCreatedQueue() {
        return new Queue(PRODUCT_CREATED_QUEUE, true);
    }

    @Bean
    public TopicExchange productCreatedExchange() {
        return new TopicExchange(PRODUCT_CREATED_EXCHANGE);
    }

    @Bean
    public Binding productCreatedBinding(Queue productCreatedQueue, TopicExchange productCreatedExchange) {
        return BindingBuilder
                .bind(productCreatedQueue)
                .to(productCreatedExchange)
                .with(ROUTING_KEY);
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
}