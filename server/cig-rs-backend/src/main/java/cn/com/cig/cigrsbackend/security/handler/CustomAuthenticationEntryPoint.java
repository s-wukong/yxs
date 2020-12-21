package cn.com.cig.cigrsbackend.security.handler;


import cn.com.cig.cigrsbackend.exception.ExceptionEnum;
import cn.com.cig.cigrsbackend.exception.NotLoginException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 未登录时的处理端点, 一般是抛出AuthenticationException时会进入
 */
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, AuthenticationException e) throws IOException, ServletException {
        throw new NotLoginException(ExceptionEnum.NOT_LOGIN);
    }
}
