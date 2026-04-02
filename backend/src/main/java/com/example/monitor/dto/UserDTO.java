package com.example.monitor.dto;

import lombok.Data;

import java.time.LocalDateTime;



@Data
public class UserDTO {
	String username, name, role, password;
	LocalDateTime createdAt, expiredAt;
	
	String accessToken, refreshToken;
}
