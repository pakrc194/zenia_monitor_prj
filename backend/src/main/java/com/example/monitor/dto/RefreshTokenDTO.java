package com.example.monitor.dto;

import java.time.LocalDateTime;

import lombok.Data;


@Data
public class RefreshTokenDTO {
	String username, token;
	LocalDateTime expiredAt;
}
