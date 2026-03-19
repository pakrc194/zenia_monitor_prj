package com.example.monitor.dto;

import java.util.Date;

import lombok.Data;

@Data
public class HourlyStatsDTO {
	Date date;
	int hour, ok, ng, total;
}
