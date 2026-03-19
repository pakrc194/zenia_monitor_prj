package com.example.monitor.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.monitor.dto.CountResultResponse;
import com.example.monitor.dto.HourlyStatsDTO;
import com.example.monitor.dto.InspectionDTO;
import com.example.monitor.service.InspectionService;

@RestController
@RequestMapping("/inspection")
public class InspectionController {
	@Autowired
	InspectionService inspectionService;
	
	@GetMapping("status")
	List<CountResultResponse> countStatus() {
		return inspectionService.countAllGroupByResult(0);
	}
	
	@GetMapping("status/{deviceId}")
	List<CountResultResponse> countStatusByDeviceId(@PathVariable int deviceId) {
		return inspectionService.countAllGroupByResult(deviceId);
	}
	
	@GetMapping("detail/{deviceId}")
	List<InspectionDTO> inspectionDetail(@PathVariable int deviceId, @ModelAttribute InspectionDTO dto) {
		return inspectionService.findAllByDeviceId(dto);
	}
	
	@GetMapping("total")
	List<CountResultResponse> totalAllGroupByResult() {
		return inspectionService.totalAllGroupByResult();
	}
	
	@GetMapping("hourlyStats")
	List<HourlyStatsDTO> hourlyStats(@RequestParam(name="date") String date, @RequestParam(name="deviceId", required=false, defaultValue = "0") int deviceId) {
		return inspectionService.countByDate(date, deviceId);
	}
}
