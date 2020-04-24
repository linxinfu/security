package com.lxf.security.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-24
 */
public class UserConfig {
    private String name;
    private String nickname;
    private String passwordHash;
    private boolean lockMonitor;
    private String certificationUrl;

    @JsonProperty("create_at")
    private String createAt;
    @JsonProperty("update_at")
    private String updateAt;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    @JsonProperty("password_hash")
    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    @JsonProperty("lock_monitor")
    public boolean isLockMonitor() {
        return lockMonitor;
    }

    public void setLockMonitor(boolean lockMonitor) {
        this.lockMonitor = lockMonitor;
    }

    @JsonProperty("certification_url")
    public String getCertificationUrl() {
        return certificationUrl;
    }

    public void setCertificationUrl(String certificationUrl) {
        this.certificationUrl = certificationUrl;
    }

    public String getCreateAt() {
        return createAt;
    }

    public void setCreateAt(String createAt) {
        this.createAt = createAt;
    }

    public String getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(String updateAt) {
        this.updateAt = updateAt;
    }

    @Override
    public String toString() {
        return "UserConfig{" +
                "name='" + name + '\'' +
                ", nickname='" + nickname + '\'' +
                ", passwordHash='" + passwordHash + '\'' +
                ", lockMonitor=" + lockMonitor +
                ", certificationUrl='" + certificationUrl + '\'' +
                ", createAt='" + createAt + '\'' +
                ", updateAt='" + updateAt + '\'' +
                '}';
    }
}
