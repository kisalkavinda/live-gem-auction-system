package com.gemhaven;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GemhavenBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(GemhavenBackendApplication.class, args);
	}

}
