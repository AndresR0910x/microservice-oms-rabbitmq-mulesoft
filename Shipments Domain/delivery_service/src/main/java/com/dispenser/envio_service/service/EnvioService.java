package com.dispenser.envio_service.service;

import com.dispenser.envio_service.model.Envio;
import com.dispenser.envio_service.repository.EnvioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EnvioService {
    @Autowired
    private EnvioRepository envioRepository;

    public Envio save(Envio envio) {
        return envioRepository.save(envio);
    }

    public Optional<Envio> findById(Long idEnvio) {
        return envioRepository.findById(idEnvio);
    }
}