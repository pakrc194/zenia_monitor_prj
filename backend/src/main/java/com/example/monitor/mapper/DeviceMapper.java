package com.example.monitor.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.monitor.dto.DeviceDTO;
import com.example.monitor.dto.PageRequest;

@Mapper
public interface DeviceMapper {
	
	@Select("""
			select d.*, ds.device_id, ds.status, ds.created_at as status_at from device_status ds 
			join (select ds.device_id, max(ds.created_at) as status_at from device_status ds group by ds.device_id) t
			on ds.created_at = t.status_at and ds.device_id =t.device_id
			join device d on ds.device_id = d.id
			""")
	List<DeviceDTO> list(PageRequest pageReq);
}
