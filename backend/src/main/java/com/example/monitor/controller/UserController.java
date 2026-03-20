package com.example.monitor.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
	
	@PostMapping("signup")
	int signup(@RequestBody UserDTO dto) {
		return userService.signup(dto);
	}
	
	@GetMapping("detail/{username}")
	UserDTO detail(@ModelAttribute UserDTO dto) {
		return userService.findByUsername(dto);
	}
	
	@PostMapping("modify/{username}")
	int modify(@RequestBody UserDTO dto, @PathVariable String username) {
		dto.setUsername(username);
		System.out.println(dto);
		return userService.update(dto);
	}
}
