package com.lxf.security.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-18
 */

@Controller
public class WebRouter {

    @RequestMapping("/")
    public String home() {
        return "manage";
    }

    @RequestMapping("/test1")
    public String test() {
        return "test";
    }
}
