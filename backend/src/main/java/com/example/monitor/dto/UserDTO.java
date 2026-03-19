package com.example.monitor.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class UserDTO {
	String username, name, role, password;
	LocalDateTime createdAt, expiredAt;
	
	String accessToken, refreshToken;
}
