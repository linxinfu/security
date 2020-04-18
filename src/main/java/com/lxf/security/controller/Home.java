package com.lxf.security.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-18
 */
@Controller
public class Home {

    @RequestMapping("/")
    public String home() {
        return "manage";
    }

    @RequestMapping("/hello")
    @ResponseBody
    public String test() {
        return "hello word";
    }
}
