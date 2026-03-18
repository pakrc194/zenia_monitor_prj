package com.example.monitor.dto;

import java.util.Date;

import lombok.Data;

@Data
public class CountResultResponse {
	int deviceId;
	String name, result, defectType;
	int count;
}
