package com.lxf.security.annotation;

import java.lang.annotation.*;

/**
 * Created by lxf.
 * Description:
 * Date: 2020-04-26
 */

@Inherited
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface CheckPassword {

    CheckPwdLevel value() default CheckPwdLevel.DO_NOTHING;

}
