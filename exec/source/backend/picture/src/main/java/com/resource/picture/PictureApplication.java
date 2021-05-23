package com.resource.picture;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class PictureApplication {
	
    public static final String LOCAL = "spring.config.location="
            + "classpath:applicationlocal.yml";
    public static final String AWS = "spring.config.location="
            + "classpath:application.yml";
	
	public static void main(String[] args) throws InterruptedException {
		SpringApplicationBuilder app = new SpringApplicationBuilder(PictureApplication.class);
        app.properties(AWS).run(args);
	}

}
