package cn.com.cig.cigrsbackend.config;

import cn.com.cig.cigrsbackend.controller.CustomErrorController;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
* @Description: 自定义异常处理器的配置类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/22
*/
@Configuration
public class CustomErrorControllerConfig {

    private ServerProperties serverProperties;

    public CustomErrorControllerConfig(ServerProperties serverProperties) {
        this.serverProperties = serverProperties;
    }

    @Bean
    public ErrorAttributes errorAttributes(){
        return new DefaultErrorAttributes(this.serverProperties.getError().isIncludeException());
    }

    @Bean
    public ErrorController errorController(ErrorAttributes errorAttributes){
        return new CustomErrorController(errorAttributes, this.serverProperties.getError().isIncludeException());
    }
}
