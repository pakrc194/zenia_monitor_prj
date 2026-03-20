package com.example.monitor.mapper;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.monitor.dto.RefreshTokenDTO;
import com.example.monitor.dto.UserDTO;

@Mapper
public interface RefreshTokenMapper {
	
	@Insert("""
			insert into refresh_token (username, token, expired_at) 
			values (#{username}, #{token}, #{expiredAt})
			on duplicate key update
				token = #{token},
				expired_at = #{expiredAt}
			""")
	int upsertToken(RefreshTokenDTO dto);

	
	@Select("select * from refresh_token where username = #{username}")
	RefreshTokenDTO findByUsername(String username);
	
	@Delete("delete from refresh_token where username = #{username}")
	int deleteByUsername(String username);
	
	@Delete("delete from refresh_token where expired_at %lt; now()")
	int deleteExpired();
	
	@Select("select * from user where username = #{username} and password=#{password} and role != 'idle'")
	UserDTO login(UserDTO dto);
}
