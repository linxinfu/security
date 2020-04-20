package com.lxf.security.config;

import com.lxf.security.utils.SnowFlake;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-01-16
 */

@Configuration
public class SecurityBean {

    @Bean
    public SnowFlake snowFlake(@Value("${snow-flake.data-center-id}") long dataCenterID,
                               @Value("${snow-flake.machine-id}") long machineId) {
        return new SnowFlake(dataCenterID, machineId);
    }

}
