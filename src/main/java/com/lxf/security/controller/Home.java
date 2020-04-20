package com.lxf.security.controller;

import com.lxf.security.entity.ServerResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-18
 */
@RestController
@RequestMapping("/api")
public class Home {

    @RequestMapping("/hello")
    public ServerResponse<Map<String, String>> test() {
        System.out.println("谁在测试");
        Map<String, String> m = new HashMap<>();
        m.put("name", "张三");
        return ServerResponse.success(m);
    }

    public String all() {

        return "";
    }
}
