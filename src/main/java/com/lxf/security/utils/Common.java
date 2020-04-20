package com.lxf.security.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-20
 */
public class Common {
    public static String getCurrentTimeStr() {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return df.format(new Date());
    }
}
