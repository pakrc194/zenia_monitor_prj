package com.example.monitor.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.example.monitor.dto.DeviceDTO;
import com.example.monitor.dto.PageRequest;

@Mapper
public interface DeviceMapper {
	
	@Select("""
			<script>
			select d.*, ds.device_id, ds.status, ds.created_at as status_at from device_status ds 
			join (select ds.device_id, max(ds.created_at) as status_at from device_status ds group by ds.device_id) t
			on ds.created_at = t.status_at and ds.device_id =t.device_id
			join device d on ds.device_id = d.id
			<if test='deviceId != 0'>
				where ds.device_id = #{deviceId}
			</if>
			</script>
			""")
	List<DeviceDTO> list(int deviceId);
	
	@Select("""
			select * from device where id = #{deviceId}
			""")
	DeviceDTO detail(DeviceDTO dto);
	
	
	@Select("""
			select d.*,
			ds.device_id, ds.cpu_usage, ds.memory_usage, 
			ds.temperature, ds.status, ds.created_at as status_at  
			from device d join device_status ds on d.id = ds.device_id where ds.device_id = #{deviceId}
			""")
	List<DeviceDTO> findAllByDeviceId(int deviceId);
}
