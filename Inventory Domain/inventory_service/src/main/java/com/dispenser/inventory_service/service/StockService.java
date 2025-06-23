package com.dispenser.inventory_service.service;

import com.dispenser.inventory_service.model.Stock;
import com.dispenser.inventory_service.repository.StockRepository;
import org.springframework.stereotype.Service;

@Service
public class StockService {
    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public Stock disminuirStock(String productoId, int cantidad) {
        Stock stock = stockRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Stock no encontrado para productoId: " + productoId));
        int nuevaCantidad = stock.getCantidad() - cantidad;
        if (nuevaCantidad < 0) {
            throw new RuntimeException("Stock insuficiente para productoId: " + productoId);
        }
        stock.setCantidad(nuevaCantidad);
        return stockRepository.save(stock);
    }

    public Stock liberarStock(String productoId, int cantidad) {
        Stock stock = stockRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Stock no encontrado para productoId: " + productoId));
        stock.setCantidad(stock.getCantidad() + cantidad);
        return stockRepository.save(stock);
    }
}