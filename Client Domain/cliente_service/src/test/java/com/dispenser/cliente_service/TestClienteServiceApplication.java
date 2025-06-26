package com.dispenser.cliente_service;

import org.springframework.boot.SpringApplication;

public class TestClienteServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(ClienteServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
