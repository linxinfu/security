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
        String path = databasePath;
        if ("prod".equals(env)) {
            String classPath = ResourceUtils.getURL("classpath:").getPath();
            path = classPath + "db/security.db";
        }

        File file = new File(path);
        if (file.exists()) {
            response.setCharacterEncoding("UTF-8");
            // response.setContentType("application/force-download");
            response.setHeader("Content-Disposition", "attachment;filename=" + java.net.URLEncoder.encode(file.getName(), "UTF-8"));
            byte[] buffer = new byte[1024];
            FileInputStream fis = null; // 文件输入流
            BufferedInputStream bis = null;

            OutputStream os; // 输出流
            try {
                os = response.getOutputStream();
                fis = new FileInputStream(file);
                bis = new BufferedInputStream(fis);
                int i = bis.read(buffer);
                while (i != -1) {
                    os.write(buffer);
                    i = bis.read(buffer);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                Objects.requireNonNull(bis).close();
                Objects.requireNonNull(fis).close();
            }
        }
        return null;
    }
}
