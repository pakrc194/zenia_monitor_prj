package com.example.monitor.dto;

import java.util.Date;

import lombok.Data;

@Data
public class AlarmDTO {
	int deviceId;
	String name;
	
	String level, message;
	Date alarmAt;
}
