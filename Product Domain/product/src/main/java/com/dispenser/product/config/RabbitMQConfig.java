package com.dispenser.product.config;

import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String PRODUCT_CREATED_QUEUE = "product.created.queue";
    public static final String PRODUCT_CREATED_EXCHANGE = "product.created.exchange";
    public static final String ROUTING_KEY = "product.created";

    @Bean
    public Queue productCreatedQueue() {
        return new Queue(PRODUCT_CREATED_QUEUE, true);
    }

    @Bean
    public TopicExchange productCreatedExchange() {
        return new TopicExchange(PRODUCT_CREATED_EXCHANGE);
    }

    @Bean
    public Binding binding(Queue productCreatedQueue, TopicExchange productCreatedExchange) {
        return BindingBuilder
                .bind(productCreatedQueue)
                .to(productCreatedExchange)
                .with(ROUTING_KEY);
    }
}