package com.example.monitor.service;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.monitor.cors.JwtUtil;
import com.example.monitor.dto.RefreshTokenDTO;
import com.example.monitor.dto.TokenRequest;
import com.example.monitor.dto.UserDTO;
import com.example.monitor.mapper.RefreshTokenMapper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
	private final JwtUtil jwtUtil;
	
	@Autowired
	RefreshTokenMapper tokenMapper;
	
	public UserDTO login(UserDTO user) {
		UserDTO userDto = tokenMapper.login(user);
		
		// 검증 완료된 username, role 받아서 토큰 발급
        String accessToken = jwtUtil.generateAccessToken(userDto.getUsername(), userDto.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(userDto.getUsername());
        
        RefreshTokenDTO dto = new RefreshTokenDTO();
        dto.setUsername(userDto.getUsername());
        dto.setToken(refreshToken);
        dto.setExpiredAt(LocalDateTime.now().plusDays(7));
        tokenMapper.upsertToken(dto);
		
        userDto.setAccessToken(accessToken);
        userDto.setRefreshToken(refreshToken);
		
		return userDto;
	}
	
	public ResponseEntity<?> upsertToken(TokenRequest request) {
		System.out.println(request);
		
		// 검증 완료된 username, role 받아서 토큰 발급
        String accessToken = jwtUtil.generateAccessToken(request.getUsername(), request.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(request.getUsername());
        
        RefreshTokenDTO dto = new RefreshTokenDTO();
        dto.setUsername(request.getUsername());
        dto.setToken(refreshToken);
        dto.setExpiredAt(LocalDateTime.now().plusDays(7));
        tokenMapper.upsertToken(dto);

        return ResponseEntity.ok(Map.of(
            "accessToken", accessToken,
            "refreshToken", refreshToken
        ));
	}
	
	public ResponseEntity<?> refreshToken(Map<String, String> body) {
		String refreshToken = body.get("refreshToken");

        if (!jwtUtil.isValid(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰");
        }

        String username = jwtUtil.getUsername(refreshToken);
        
        RefreshTokenDTO saved = tokenMapper.findByUsername(username);
        if (saved == null || !refreshToken.equals(saved.getToken())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰 불일치");
        }

        // 만료시간 확인
        if (saved.getExpiredAt().isBefore(LocalDateTime.now())) {
            tokenMapper.deleteByUsername(username);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh Token 만료");
        }
        
        // role은 DB에서 다시 조회하거나 토큰에 넣어도 됨
        String newAccessToken = jwtUtil.generateAccessToken(username, jwtUtil.getRole(refreshToken));
        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
	}
	
	public ResponseEntity<?> logout(HttpServletRequest request) {
		String token = resolveToken(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("토큰 없음");
        }
        String username = jwtUtil.getUsername(token);

        tokenMapper.deleteByUsername(username);
        
        return ResponseEntity.ok("로그아웃 완료");
	}
	

    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        return (bearer != null && bearer.startsWith("Bearer ")) ? bearer.substring(7) : null;
    }
}
