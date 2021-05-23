package com.halbu.phonebook;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;

@SpringBootApplication
public class PhonebookApplication {

    public static final String LOCAL = "spring.config.location="
            + "classpath:applicationlocal.yml";
    public static final String AWS = "spring.config.location="
            + "classpath:application.yml";
	
	public static void main(String[] args) {
		SpringApplicationBuilder app = new SpringApplicationBuilder(PhonebookApplication.class);
        app.properties(AWS).run(args);
	}

}
