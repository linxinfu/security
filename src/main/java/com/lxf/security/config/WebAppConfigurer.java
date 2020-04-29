package com.lxf.security.config;

import com.lxf.security.interceptor.CheckPwdHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-25
 */

@Configuration
public class WebAppConfigurer extends WebMvcConfigurationSupport {

    private final CheckPwdHandler checkPwdHandler;

    public WebAppConfigurer(CheckPwdHandler checkPwdHandler) {
        this.checkPwdHandler = checkPwdHandler;
    }

    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/resources/")
                .addResourceLocations("classpath:/static/")
                .addResourceLocations("classpath:/public/");
        super.addResourceHandlers(registry);
    }

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(checkPwdHandler)
                .addPathPatterns("/api/**").excludePathPatterns(getUrls());
        super.addInterceptors(registry);
    }

    @Bean
    public InternalResourceViewResolver viewResolver() {
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/");
        viewResolver.setSuffix(".html");
        return viewResolver;
    }

    /**
     * 定义需要避免过滤的url
     */
    private List<String> getUrls() {
        List<String> list = new ArrayList<>();
        list.add("/api/v1/user/login");
        list.add("/static/images/*");
        return list;
    }
}
