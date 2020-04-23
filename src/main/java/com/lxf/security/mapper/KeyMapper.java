package com.lxf.security.mapper;

import com.lxf.security.entity.Key;
import com.lxf.security.entity.LevelStatistic;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KeyMapper {
    int deleteByPrimaryKey(String id);

    int insert(Key record);

    int insertSelective(Key record);

    Key selectByPrimaryKey(String id);

    List<Key> selectAll();

    int updateByPrimaryKeySelective(Key record);

    int updateByPrimaryKey(Key record);

    List<LevelStatistic> levelStatistic();
}