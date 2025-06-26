package com.dispenser.producto_service;

import org.springframework.boot.SpringApplication;

public class TestProductoServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(ProductoServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
