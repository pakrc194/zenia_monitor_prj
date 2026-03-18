package com.example.monitor.dto;

import java.util.Date;

import lombok.Data;

@Data
public class DeviceDTO {
	int deviceId;
	String name, type, location, ipAddress;
	Date createdAt;
	
	double cpuUsage, memoryUsage, temperature;
	String status;
	Date statusAt;
}
