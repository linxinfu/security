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

    private final UserConfigMapper userConfigMapper;

    public UserConfigService(UserConfigMapper userConfigMapper) {
        this.userConfigMapper = userConfigMapper;
    }

    public UserConfig getConfig() {
        return userConfigMapper.selectByPrimaryKey("admin");
    }
}
