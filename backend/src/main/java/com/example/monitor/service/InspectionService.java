package com.example.monitor.service;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.monitor.dto.CountResultResponse;
import com.example.monitor.dto.HourlyStatsDTO;
import com.example.monitor.dto.InspectionDTO;
import com.example.monitor.mapper.InspectionMapper;

@Service
public class InspectionService {
	@Autowired
	InspectionMapper inspectionMapper;
	
	public List<CountResultResponse> countAllGroupByResult(int deviceId) {

		return inspectionMapper.countAllGroupByResult(deviceId);
	}
	
	public List<InspectionDTO> findAllByDeviceId(InspectionDTO dto) {
		return inspectionMapper.findAllByDeviceId(dto);
	}
	
	public List<CountResultResponse> totalAllGroupByResult() {
		return inspectionMapper.totalAllGroupByResult();
	}
	
	public List<HourlyStatsDTO> countByDate(String date, int deviceId) {
		return inspectionMapper.countByDate(date, deviceId);
	}
}
