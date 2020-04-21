package com.lxf.security.service;

import com.lxf.security.entity.Key;
import com.lxf.security.mapper.KeyMapper;
import com.lxf.security.utils.Common;
import com.lxf.security.utils.SnowFlake;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-20
 */

@Service
public class KeyService {
    private final KeyMapper keyMapper;
    private final SnowFlake snowFlake;

    @Autowired
    public KeyService(SnowFlake snowFlake, KeyMapper keyMapper) {
        this.snowFlake = snowFlake;
        this.keyMapper = keyMapper;
    }

    public List<Key> getAllKey() {
        return keyMapper.selectAll();
    }

    public boolean createKey(Key key) {
        key.setValid(true);
        key.setId(String.valueOf(snowFlake.nextId()));
        key.setCreateAt(Common.getCurrentTimeStr());
        return keyMapper.insert(key) == 1;
    }

    public boolean deleteKey(String keyId){
        System.out.println(keyMapper.selectByPrimaryKey(keyId));
        return keyMapper.deleteByPrimaryKey(keyId) == 1;
    }

}
