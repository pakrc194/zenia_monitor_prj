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
	
	public int signup(UserDTO dto) {
		if(userMapper.findByUsername(dto.getUsername()).size()>0) {
			return 0;
		} else {
			return userMapper.save(dto);
		}
	}
	
	public UserDTO findByUsername(UserDTO dto) {
		return userMapper.findByUsername(dto.getUsername()).getFirst();
	}
	
	public int update(UserDTO dto) {
		return userMapper.updateUser(dto);
	}
}
