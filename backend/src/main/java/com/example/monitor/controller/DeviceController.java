package com.example.monitor.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.monitor.dto.DeviceDTO;
import com.example.monitor.dto.PageRequest;
import com.example.monitor.service.DeviceService;

@RestController
@RequestMapping("/device")
public class DeviceController {
	@Autowired
	DeviceService deviceService;
	
	@GetMapping("list")
	List<DeviceDTO> deviceList(@ModelAttribute PageRequest pageReq) {
		return deviceService.list(pageReq);
	}
}
