package com.halbu.user.config;

import java.util.Arrays;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.halbu.user.interceptor.AuthInterceptor;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Configuration
public class AuthConfig implements WebMvcConfigurer{
	private AuthInterceptor authInterceptor;
	
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(authInterceptor)
		.addPathPatterns("/emergency/**");
//		.excludePathPatterns(Arrays.asList("/phonebook/swagger"));
	}
}
