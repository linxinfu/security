package com.lxf.security.controller;

import com.lxf.security.entity.Key;
import com.lxf.security.entity.ServerResponse;
import com.lxf.security.service.KeyService;
import com.lxf.security.utils.Common;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-20
 */

@RestController
@RequestMapping("/api/v1/key")
public class KeyController {

    private final KeyService keyService;

    public KeyController(KeyService keyService) {
        this.keyService = keyService;
    }

    @RequestMapping("/get_all")
    public ServerResponse<List<Key>> getAllKeys() {
        return ServerResponse.success("获取key成功", keyService.getAllKey());
    }

    @PostMapping("/add")
    public ServerResponse<Boolean> create(@RequestBody Key key) {
        boolean success = keyService.createKey(key);
        return success ? ServerResponse.success("新建成功") : ServerResponse.error("新建失败");
    }

    @PostMapping("/delete/{keyId}")
    public ServerResponse<Boolean> delete(@PathVariable String keyId) {
        if (keyId.isEmpty()) {
            return ServerResponse.error("参数异常");
        }
        boolean success = keyService.deleteKey(keyId);
        return success ? ServerResponse.success("删除成功") : ServerResponse.error("删除失败");
    }

    @PostMapping("/update")
    public ServerResponse<Boolean> update(@RequestBody Key key) {
        if (key.getId() == null || key.getId().isEmpty()) {
            return ServerResponse.error("参数异常");
        }
        key.setUpdateAt(Common.getCurrentTimeStr());
        boolean success = keyService.updateKey(key);
        return success ? ServerResponse.success("更新成功") : ServerResponse.error("更新失败");
    }

    @GetMapping("/statistics")
    public ServerResponse<Object> statistics() {
        return ServerResponse.success("获取成功", keyService.levelStatistic());
    }
}