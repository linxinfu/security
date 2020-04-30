package com.lxf.security.controller;

import com.lxf.security.entity.ServerResponse;
import com.lxf.security.entity.UserConfig;
import com.lxf.security.service.KeyService;
import com.lxf.security.service.UserConfigService;
import org.springframework.web.bind.annotation.*;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-24
 */

@RestController
@RequestMapping("/api/v1/config")
public class UserConfigController {

    private final UserConfigService userConfigService;

    private final KeyService keyService;

    public UserConfigController(UserConfigService userConfigService, KeyService keyService) {
        this.userConfigService = userConfigService;
        this.keyService = keyService;
    }

    @RequestMapping("/get")
    public ServerResponse<UserConfig> getConfig() {
        return ServerResponse.success("获取配置成功", userConfigService.getConfig());
    }

    @PostMapping("/add_primary_key")
    public ServerResponse<Boolean> update(@RequestBody UserConfig param) {
        int keyCount = keyService.getAllKey().size();
        if (keyCount > 0) {
            return ServerResponse.error("有个" + keyCount + "密钥占用原主密码，不能修改。");
        }
        param.setName("admin");
        boolean success = userConfigService.update(param);
        return success ? ServerResponse.success("新增成功") : ServerResponse.error("新增失败");
    }

    @RequestMapping("/check_key")
    public ServerResponse<Boolean> checkPrimaryKey(@RequestParam(value = "hash", defaultValue = "") String hash) {
        if (hash.isEmpty()) {
            return ServerResponse.error("校验失败");
        }
        boolean success = userConfigService.checkPrimaryKey(hash);
        return success ? ServerResponse.success("校验成功") : ServerResponse.error("校验失败");
    }
}
