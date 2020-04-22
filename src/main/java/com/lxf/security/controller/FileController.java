package com.lxf.security.controller;

import org.springframework.beans.factory.annotation.Autowired;
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

    @RequestMapping("/database")
    public String downLoad(HttpServletResponse response) throws IOException {
        System.out.println(databasePath);
        String path = ResourceUtils.getURL("classpath:").getPath();
        System.out.println("第三季爱欧弟就😯" + path);

        File file = new File(databasePath);
        if (file.exists()) {
            response.setCharacterEncoding("UTF-8");
            // response.setContentType("application/force-download");
            response.setHeader("Content-Disposition", "attachment;fileName=" + java.net.URLEncoder.encode(file.getName(), "UTF-8"));
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
