package com.dispenser.inventory_service.listener;

import com.dispenser.inventory_service.model.Stock;
import com.dispenser.inventory_service.repository.StockRepository;
import com.dispenser.orders_service.event.OrderCreatedEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class OrderCreatedListener {
    private final StockRepository stockRepository;

    public OrderCreatedListener(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @RabbitListener(queues = "inventory.order.created")
    public void handleOrderCreated(OrderCreatedEvent event) {
        for (var item : event.getItems()) {
            Stock stock = stockRepository.findById(item.getItemId())
                    .orElseGet(() -> {
                        Stock newStock = new Stock();
                        newStock.setItemId(item.getItemId());
                        newStock.setQuantity(0);
                        return newStock;
                    });
            stock.setQuantity(stock.getQuantity() + item.getQuantity());
            stockRepository.save(stock);
        }
    }
}