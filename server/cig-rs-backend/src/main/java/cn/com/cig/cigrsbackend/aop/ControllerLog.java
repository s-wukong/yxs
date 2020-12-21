package cn.com.cig.cigrsbackend.aop;

import java.lang.annotation.*;

/**
* @Description: 凡是加上这个注解的controller都会有日志记录
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/10/15
*/
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
@Documented
public @interface ControllerLog {
    /**
     * 日志描述信息
     *
     * @return
     */
    String description() default "";
}