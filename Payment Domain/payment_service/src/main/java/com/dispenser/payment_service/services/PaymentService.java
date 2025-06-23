package com.dispenser.payment_service.services;

import com.dispenser.payment_service.model.Payment;
import com.dispenser.payment_service.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment simulatePayment(Long orderId) {
        Payment payment = paymentRepository.findById(orderId)
                .orElseGet(() -> {
                    Payment newPayment = new Payment();
                    newPayment.setOrderId(orderId);
                    return newPayment;
                });
        // Simple simulation: 80% chance of success, 20% chance of failure
        Random random = new Random();
        boolean success = random.nextDouble() < 0.8;
        payment.setStatus(success ? "SUCCESS" : "FAILURE");
        payment.setProcessingDate(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);
        // TODO: Publish 'PaymentProcessed' event to RabbitMQ with data: { orderId: savedPayment.getOrderId(), status: savedPayment.getStatus() }
        return savedPayment;
    }
}