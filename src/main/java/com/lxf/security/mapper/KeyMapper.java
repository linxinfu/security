package com.lxf.security.mapper;

import com.lxf.security.entity.Key;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KeyMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Key record);

    int insertSelective(Key record);

    Key selectByPrimaryKey(Integer id);

    List<Key> selectAll();

    int updateByPrimaryKeySelective(Key record);

    int updateByPrimaryKey(Key record);
}