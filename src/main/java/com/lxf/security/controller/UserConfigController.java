package com.lxf.security.controller;

import com.lxf.security.entity.ServerResponse;
import com.lxf.security.entity.UserConfig;
import com.lxf.security.service.UserConfigService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-24
 */

@RestController
@RequestMapping("/api/v1/config")
public class UserConfigController {

    private final UserConfigService userConfigService;

    public UserConfigController(UserConfigService userConfigService) {
        this.userConfigService = userConfigService;
    }

    @RequestMapping("/get")
    public ServerResponse<UserConfig> getConfig() {
        return ServerResponse.success("获取配置成功", userConfigService.getConfig());
    }

    @PostMapping("/add_primary_key")
    public ServerResponse<Boolean> update(@RequestBody UserConfig param) {
        UserConfig userConfig = userConfigService.getConfig();
        if (!(userConfig.getPasswordHash() == null || userConfig.getPasswordHash().isEmpty())) {
            return ServerResponse.error("已经设置了主密码，暂不支持修改");
        }
        param.setName("admin");
        boolean success = userConfigService.update(param);
        return success ? ServerResponse.success("新增成功") : ServerResponse.error("新增失败");
    }

}
