package com.example.monitor.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.monitor.dto.UserDTO;
import com.example.monitor.mapper.UserMapper;

@Service
public class UserService {
	
	@Autowired
	UserMapper userMapper;
	
	public List<UserDTO> list() {
		return userMapper.findAll();
	}
}
