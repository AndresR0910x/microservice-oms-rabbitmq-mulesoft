package com.dispenser.envio_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String ENVIO_PROCESS_QUEUE = "envio.process.queue";
    public static final String ENVIO_COMPLETED_EXCHANGE = "envio.completed.exchange";
    public static final String ENVIO_COMPLETED_ROUTING_KEY = "envio.completed";

    @Bean
    public Queue envioProcessQueue() {
        return new Queue(ENVIO_PROCESS_QUEUE, true);
    }

    @Bean
    public TopicExchange envioCompletedExchange() {
        return new TopicExchange(ENVIO_COMPLETED_EXCHANGE);
    }

    @Bean
    public Binding binding(Queue envioProcessQueue, TopicExchange envioCompletedExchange) {
        return BindingBuilder
                .bind(envioProcessQueue)
                .to(envioCompletedExchange)
                .with(ENVIO_COMPLETED_ROUTING_KEY);
    }

    @Bean
    public TopicExchange despachoUpdateExchange() {
        return new TopicExchange("despacho.update.exchange");
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        return new RabbitTemplate(connectionFactory);
    }
}