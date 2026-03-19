package com.example.monitor.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.monitor.dto.AlarmDTO;
import com.example.monitor.mapper.AlarmMapper;

@Service
public class AlarmService {
	@Autowired
	AlarmMapper alarmMapper;
	
	public List<AlarmDTO> findAll() {
		return alarmMapper.findAll();
	}
}
