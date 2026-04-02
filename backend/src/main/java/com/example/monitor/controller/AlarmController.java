package com.example.monitor.controller;

import java.util.List;

import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.monitor.dto.AlarmDTO;
import com.example.monitor.service.AlarmService;

@RestController
@RequestMapping("/alarm")
public class AlarmController {
	@Resource
	AlarmService alarmService;
	
	@GetMapping("list")
	List<AlarmDTO> list() {
		return alarmService.findAll(); 
	}
}
