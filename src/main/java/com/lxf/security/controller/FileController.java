package com.lxf.security.controller;

import com.lxf.security.annotation.CheckPassword;
import com.lxf.security.annotation.CheckPwdLevel;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Objects;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-22
 */

@Controller
@RequestMapping("/api/v1/file")
public class FileController {

    @Value("${database-file-path}")
    String databasePath;

    @Value("${spring.profiles.active}")
    String env;

    @RequestMapping("/database")
    @CheckPassword(CheckPwdLevel.CHECK_PWD)
    public String downLoad(HttpServletResponse response) throws IOException {
        InputStream dbFile = null;
        switch (env) {
            case "prod": // 打包成jar包后，目标路径不是一个文件夹内，而是压缩包，需要以流的方式读取
                dbFile = this.getClass().getResourceAsStream(databasePath);
                break;

            case "dev":
                File file = new File(databasePath);
                if (file.exists()) {
                    dbFile = new FileInputStream(file);
                }
                break;
        }
        if (dbFile == null) {
            response.setStatus(202);
            return "";
        }
        response.setCharacterEncoding("UTF-8");
        // response.setContentType("application/force-download");
        String filename = databasePath.substring(databasePath.lastIndexOf("/") + 1);
        response.setHeader("Content-Disposition", "attachment;filename=" + java.net.URLEncoder.encode(filename, "UTF-8"));
        byte[] buffer = new byte[1024];
        BufferedInputStream bis = null;

        OutputStream os; // 输出流
        try {
            os = response.getOutputStream();
            bis = new BufferedInputStream(dbFile);
            int i = bis.read(buffer);
            while (i != -1) {
                os.write(buffer);
                i = bis.read(buffer);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            Objects.requireNonNull(bis).close();
            Objects.requireNonNull(dbFile).close();
        }

        return null;
    }
}
