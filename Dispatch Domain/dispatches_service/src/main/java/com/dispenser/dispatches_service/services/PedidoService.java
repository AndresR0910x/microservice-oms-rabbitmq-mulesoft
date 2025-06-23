package com.dispenser.dispatches_service.services;

import com.dispenser.dispatches_service.model.*;
import com.dispenser.dispatches_service.repository.*;
import org.springframework.stereotype.Service;

@Service
public class PedidoService {
    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    public Dispatch cambiarEstado(Long ordenId, String estado) {
        Dispatch pedido = pedidoRepository.findById(ordenId)
                .orElseGet(() -> {
                    Dispatch newPedido = new Dispatch();
                    newPedido.setOrdenId(ordenId);
                    return newPedido;
                });
        pedido.setEstado(estado);
        return pedidoRepository.save(pedido);
    }

    public Dispatch marcarListoParaEnvio(Long ordenId) {
        return cambiarEstado(ordenId, "LISTO_PARA_ENVIO");
    }
}