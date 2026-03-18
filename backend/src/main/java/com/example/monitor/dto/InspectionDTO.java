package com.example.monitor.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class InspectionDTO {
	int deviceId;
	String name;
	
	String productId, result, defectType;
	Date resultAt;
}
