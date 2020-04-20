package com.lxf.security.controller;

import com.lxf.security.entity.Key;
import com.lxf.security.entity.ServerResponse;
import com.lxf.security.service.KeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
        System.out.println(key);
        boolean success = keyService.createKey(key);
        return success ? ServerResponse.success("新建成功") : ServerResponse.error("新建失败");
    }

}
