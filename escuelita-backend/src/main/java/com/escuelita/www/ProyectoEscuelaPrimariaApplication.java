package com.escuelita.www;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ProyectoEscuelaPrimariaApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProyectoEscuelaPrimariaApplication.class, args);
	}

}
