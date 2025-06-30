package com.dispenser.dispatch_service;

import org.springframework.boot.SpringApplication;

public class TestDispatchServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(DispatchServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
