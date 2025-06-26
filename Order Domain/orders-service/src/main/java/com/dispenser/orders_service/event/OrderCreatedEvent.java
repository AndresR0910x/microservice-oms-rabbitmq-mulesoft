package com.dispenser.orders_service.event;
import com.dispenser.orders_service.model.*;

import java.util.List;

public class OrderCreatedEvent {
    private Long orderId;
    private List<OrderItem> items;

    public OrderCreatedEvent() {}
    public OrderCreatedEvent(Long orderId, List<OrderItem> items) {
        this.orderId = orderId;
        this.items = items;
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}