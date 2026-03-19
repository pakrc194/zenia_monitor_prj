package com.example.monitor.mapper;

import java.util.Date;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.example.monitor.dto.CountResultResponse;
import com.example.monitor.dto.HourlyStatsDTO;
import com.example.monitor.dto.InspectionDTO;

@Mapper
public interface InspectionMapper {
	@Select("""
				<script>
				select * from device d 
				join (select ir.device_id, ir.`result` , ir.defect_type , count(*) as count 
					from device d join inspection_result ir on d.id = ir.device_id 
					group by ir.`result` , ir.defect_type, ir.device_id) t 
				on d.id  = t.device_id
				<if test='deviceId != 0'>
					where device_id = #{deviceId}
				</if>
				</script> 
			""")
	List<CountResultResponse> countAllGroupByResult(int deviceId);
	
	@Select("""
			select d.*,
			ir.device_id, ir.product_id, ir.result, ir.defect_type, ir.created_at as result_at 
			from device d join inspection_result ir on d.id = ir.device_id 
			where ir.device_id = #{deviceId} and 
			ir.created_at between concat(#{date}, ' 00:00:00') and concat(#{date}, ' 23:59:59')
			order by result_at desc
			""")
	List<InspectionDTO> findAllByDeviceId(InspectionDTO dto);
	
	@Select("""
			select DATE(ir.created_at), ir.`result` ,count(*) as count 
			from device d join inspection_result ir on d.id = ir.device_id 
			where DATE(ir.created_at) = DATE(now())
			group by DATE(ir.created_at), ir.`result` 
			""")
	List<CountResultResponse> totalAllGroupByResult();
	
	@Select("""
			<script>
			select 
				DATE(ir.created_at) as date, 
				HOUR(ir.created_at) as hour,
				SUM(ir.result = 'OK') as ok,
				SUM(ir.result = 'NG') as ng,
				count(*) as total
			from device d join inspection_result ir on d.id = ir.device_id 
			where Date(ir.created_at) = #{date}
			<if test='deviceId != 0'>
				and ir.device_id = #{deviceId}
			</if>
			group by DATE(ir.created_at),HOUR(ir.created_at)
			</script>

			""")
	List<HourlyStatsDTO> countByDate(String date, int deviceId);
}
