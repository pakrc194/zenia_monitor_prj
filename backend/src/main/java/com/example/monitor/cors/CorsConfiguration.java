package com.example.monitor.cors;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**")
		.allowedMethods("GET", "POST")
		.allowedOrigins("http://192.168.10.10:5173", "http://localhost:5173")
		.allowedHeaders("*")
		.allowCredentials(true);
	}
}
