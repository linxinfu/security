package com.lxf.security.service;

import com.lxf.security.entity.UserConfig;
import com.lxf.security.mapper.UserConfigMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-24
 */

@Service
public class UserConfigService {

    private final static String DEFAULT_USER = "admin";

    private final UserConfigMapper userConfigMapper;

    public UserConfigService(UserConfigMapper userConfigMapper) {
        this.userConfigMapper = userConfigMapper;
    }

    public UserConfig getConfig() {
        return userConfigMapper.selectByPrimaryKey(DEFAULT_USER);
    }

    public boolean checkPrimaryKey(String hash) {
        UserConfig userConfig = userConfigMapper.selectByPrimaryKey(DEFAULT_USER);
        if (userConfig.getPasswordHash() == null || userConfig.getPasswordHash().isEmpty()) return false;

        return hash.equals(userConfig.getPasswordHash());
    }

    public boolean update(UserConfig userConfig) {
        return userConfigMapper.updateByPrimaryKeySelective(userConfig) == 1;
    }
}