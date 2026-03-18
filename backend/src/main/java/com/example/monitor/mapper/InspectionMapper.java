package com.example.monitor.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.monitor.dto.CountResultResponse;
import com.example.monitor.dto.InspectionDTO;

@Mapper
public interface InspectionMapper {
	@Select("""
				select * from device d 
				join (select ir.device_id, ir.`result` , ir.defect_type , count(*) as count 
					from device d join inspection_result ir on d.id = ir.device_id 
					group by ir.`result` , ir.defect_type, ir.device_id) t 
				on d.id  = t.device_id 
			""")
	List<CountResultResponse> countAllGroupByResult();
	
	@Select("""
			select d.*,
			ir.device_id, ir.product_id, ir.result, ir.defect_type, ir.created_at as result_at 
			from device d join inspection_result ir on d.id = ir.device_id 
			where ir.device_id = #{deviceId}
			order by result_at desc
			""")
	List<InspectionDTO> findAllByDeviceId(int deviceId);
}
