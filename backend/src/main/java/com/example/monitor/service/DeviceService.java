package com.example.monitor.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.monitor.dto.DeviceDTO;
import com.example.monitor.dto.PageRequest;
import com.example.monitor.mapper.DeviceMapper;

@Service
public class DeviceService {
	
	@Autowired
	DeviceMapper deviceMapper;
	
	public List<DeviceDTO> list(PageRequest pageReq) {
		return deviceMapper.list(pageReq);
	}
	
	public DeviceDTO detail(DeviceDTO dto) {
		return deviceMapper.detail(dto);
	}
	
	public List<DeviceDTO> findAllByDeviceId(DeviceDTO dto) {
		return deviceMapper.findAllByDeviceId(dto.getDeviceId());
	}
}
