package com.example.monitor.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.monitor.dto.UserDTO;

@Mapper
public interface UserMapper {
	
	@Select("select * from user")
	List<UserDTO> findAll();
}
