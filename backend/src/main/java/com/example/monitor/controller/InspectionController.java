package com.example.monitor.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.monitor.dto.CountResultResponse;
import com.example.monitor.dto.InspectionDTO;
import com.example.monitor.service.InspectionService;

@RestController
@RequestMapping("/inspection")
public class InspectionController {
	@Autowired
	InspectionService inspectionService;
	
	@GetMapping("status")
	List<CountResultResponse> countStatus() {
		return inspectionService.countAllGroupByResult();
	}
	
	@GetMapping("detail/{deviceId}")
	List<InspectionDTO> inspectionDetail(@PathVariable int deviceId) {
		return inspectionService.findAllByDeviceId(deviceId);
	}
}
