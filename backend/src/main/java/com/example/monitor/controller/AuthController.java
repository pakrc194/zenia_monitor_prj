package com.example.monitor.controller;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.monitor.cors.JwtUtil;
import com.example.monitor.dto.TokenRequest;
import com.example.monitor.dto.UserDTO;
import com.example.monitor.service.RefreshTokenService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtUtil jwtUtil;

    @Autowired
    RefreshTokenService tokenService;
    
    @PostMapping("/login")
    public UserDTO login(@RequestBody UserDTO user) {
    	return tokenService.login(user);
    }

    // Access Token 재발급
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        return tokenService.refreshToken(body);
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        return tokenService.logout(request);
    }

}