package com.example.monitor.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.monitor.dto.AlarmDTO;

@Mapper
public interface AlarmMapper {
	
	@Select("""
			select d.*, 
			al.device_id, al.level, al.message, al.created_at as alarm_at
			from device d join alarm_log al on d.id = al.device_id 
			""")
	List<AlarmDTO> findAll();
}
