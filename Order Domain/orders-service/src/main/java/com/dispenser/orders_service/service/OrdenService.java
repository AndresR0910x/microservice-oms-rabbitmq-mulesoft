package com.dispenser.orders_service.service;

import com.dispenser.orders_service.model.Orden;
import com.dispenser.orders_service.repository.OrdenRepository;
import com.dispenser.orders_service.dto.Cliente;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrdenService {
    private static final Logger logger = LoggerFactory.getLogger(OrdenService.class);

    @Autowired
    private OrdenRepository ordenRepository;
    
    @Autowired
    private RestTemplate restTemplate;

    private final String CLIENTE_SERVICE_URL = "http://localhost:8083/api/clientes/";

    public Orden crearOrden(Orden orden) {
        if (orden.getIdCliente() == null) {
            throw new IllegalArgumentException("El ID del cliente es requerido");
        }
        logger.info("Solicitando cliente con ID: {}", orden.getIdCliente());
        Cliente cliente = restTemplate.getForObject(CLIENTE_SERVICE_URL + orden.getIdCliente(), Cliente.class);
        logger.info("Cliente recibido: {}", cliente != null ? cliente.toString() : "null");
        if (cliente == null) {
            throw new RuntimeException("Cliente no encontrado con ID: " + orden.getIdCliente());
        }
        orden.setCliente(cliente);
        logger.info("Orden antes de guardar: idOrden={}, idCliente={}, fecha={}, estado={}, cliente={}",
                orden.getIdOrden(), orden.getIdCliente(), orden.getFecha(), orden.getEstado(),
                orden.getCliente() != null ? orden.getCliente().toString() : "null");
        Orden savedOrden = ordenRepository.save(orden);
        savedOrden.setCliente(cliente); // Reasignar cliente para la respuesta
        logger.info("Orden guardada: idOrden={}, idCliente={}, fecha={}, estado={}, cliente={}",
                savedOrden.getIdOrden(), savedOrden.getIdCliente(), savedOrden.getFecha(), savedOrden.getEstado(),
                savedOrden.getCliente() != null ? savedOrden.getCliente().toString() : "null");
        return savedOrden;
    }

    public List<Orden> obtenerTodasLasOrdenes() {
        List<Orden> ordenes = ordenRepository.findAll();
        // Llenar el campo cliente para cada orden
        return ordenes.stream().map(this::fillCliente).collect(Collectors.toList());
    }

    public Orden actualizarOrden(Long id, Orden ordenDetalles) {
        Optional<Orden> ordenOptional = ordenRepository.findById(id);
        if (ordenOptional.isPresent()) {
            Orden orden = ordenOptional.get();
            
            if (ordenDetalles.getIdCliente() != null) {
                Cliente cliente = restTemplate.getForObject(
                    CLIENTE_SERVICE_URL + ordenDetalles.getIdCliente(), 
                    Cliente.class);
                if (cliente == null) {
                    throw new RuntimeException("Cliente no encontrado con ID: " + ordenDetalles.getIdCliente());
                }
                orden.setCliente(cliente);
            }
            
            if (ordenDetalles.getFecha() != null) {
                orden.setFecha(ordenDetalles.getFecha());
            }
            
            if (ordenDetalles.getEstado() != null) {
                orden.setEstado(ordenDetalles.getEstado());
            }
            
            logger.info("Orden antes de actualizar: idOrden={}, idCliente={}, fecha={}, estado={}, cliente={}",
                    orden.getIdOrden(), orden.getIdCliente(), orden.getFecha(), orden.getEstado(),
                    orden.getCliente() != null ? orden.getCliente().toString() : "null");
            Orden updatedOrden = ordenRepository.save(orden);
            updatedOrden.setCliente(orden.getCliente()); // Reasignar cliente para la respuesta
            logger.info("Orden actualizada: idOrden={}, idCliente={}, fecha={}, estado={}, cliente={}",
                    updatedOrden.getIdOrden(), updatedOrden.getIdCliente(), updatedOrden.getFecha(), updatedOrden.getEstado(),
                    updatedOrden.getCliente() != null ? updatedOrden.getCliente().toString() : "null");
            return updatedOrden;
        }
        throw new RuntimeException("Orden no encontrada con ID: " + id);
    }

    public List<Orden> obtenerOrdenesPorCliente(Long idCliente) {
        List<Orden> ordenes = ordenRepository.findByIdCliente(idCliente);
        // Llenar el campo cliente para cada orden
        return ordenes.stream().map(this::fillCliente).collect(Collectors.toList());
    }

    private Orden fillCliente(Orden orden) {
        if (orden.getIdCliente() != null) {
            logger.info("Solicitando cliente con ID: {}", orden.getIdCliente());
            Cliente cliente = restTemplate.getForObject(CLIENTE_SERVICE_URL + orden.getIdCliente(), Cliente.class);
            logger.info("Cliente recibido: {}", cliente != null ? cliente.toString() : "null");
            if (cliente != null) {
                orden.setCliente(cliente);
            }
        }
        return orden;
    }
}