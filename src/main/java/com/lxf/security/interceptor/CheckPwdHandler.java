package com.lxf.security.interceptor;

import com.lxf.security.annotation.CheckPassword;
import com.lxf.security.service.UserConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-26
 */

@Component
public class CheckPwdHandler extends HandlerInterceptorAdapter {

    @Autowired
    UserConfigService userConfigService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (handler.getClass().isAssignableFrom(HandlerMethod.class)) {
            HandlerMethod handlerMethod = (HandlerMethod) handler;
            CheckPassword annotation = handlerMethod.getMethodAnnotation(CheckPassword.class);
            if (annotation != null) {
                switch (annotation.value()) {
                    case CHECK_PWD:
                        String hash = request.getParameter("hash");
                        if (!userConfigService.checkPrimaryKey(hash)) {
                            response.setStatus(202);
                            return false;
                        }

                    case DO_NOTHING:
                        break;
                }
            }
        }
        return super.preHandle(request, response, handler);
    }
}
