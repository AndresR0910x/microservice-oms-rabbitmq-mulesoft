package com.dispenser.payment_service.controller;

import com.dispenser.payment_service.model.Payment;
import com.dispenser.payment_service.services.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/{orderId}/simulate")
    public ResponseEntity<Payment> simulatePayment(@PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.simulatePayment(orderId));
    }
}