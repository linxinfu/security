package com.lxf.security.mapper;

import com.lxf.security.entity.UserConfig;
import org.springframework.stereotype.Repository;

@Repository
public interface UserConfigMapper {
    int deleteByPrimaryKey(String name);

    int insert(UserConfig record);

    int insertSelective(UserConfig record);

    UserConfig selectByPrimaryKey(String name);

    int updateByPrimaryKeySelective(UserConfig record);

    int updateByPrimaryKey(UserConfig record);
}