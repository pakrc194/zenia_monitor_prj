package com.example.monitor.service;

import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.monitor.dto.CountResultResponse;
import com.example.monitor.dto.InspectionDTO;
import com.example.monitor.mapper.InspectionMapper;

@Service
public class InspectionService {
	@Autowired
	InspectionMapper inspectionMapper;
	
	public List<CountResultResponse> countAllGroupByResult() {

		return inspectionMapper.countAllGroupByResult();
	}
	
	public List<InspectionDTO> findAllByDeviceId(int deviceId) {
		return inspectionMapper.findAllByDeviceId(deviceId);
	}
	
}
