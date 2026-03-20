package com.example.monitor.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.example.monitor.dto.UserDTO;

@Mapper
public interface UserMapper {
	
	@Select("select * from user")
	List<UserDTO> findAll();
	
	@Insert("""
			insert into user (username, name, role, created_at)
			values (#{username}, #{name}, #{role}, now())
			""")
	int save(UserDTO dto);
	
	@Select("select * from user where username = #{username}")
	List<UserDTO> findByUsername(String username);
	
	@Update("""
			<script>
			update user 
			set role=#{role} 
			<choose>
		        <when test='role == "idle"'>
		            , expired_at = now() 
		        </when>
		        <otherwise>
		            , expired_at = NULL 
		        </otherwise>
		    </choose>
			where username = #{username}
			</script>
			""")
	int updateUser(UserDTO dto);
}
