package com.example.monitor.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.monitor.dto.UserDTO;
import com.example.monitor.service.UserService;


@RestController
@RequestMapping("/users")
public class UserController {
	@Autowired
	UserService userService;
	
	
	@GetMapping("list")
	List<UserDTO> list() {
		return userService.list();
	}
}
