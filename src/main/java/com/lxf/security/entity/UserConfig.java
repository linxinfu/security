package com.lxf.security.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-24
 */
public class UserConfig {
    private String name;
    private String passwordHash;
    private boolean lockMonitor;

    @JsonProperty("create_at")
    private String createAt;
    @JsonProperty("update_at")
    private String updateAt;
}
