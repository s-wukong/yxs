package cn.com.cig.cigrsbackend.security;


import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.exception.ExceptionEnum;
import cn.com.cig.cigrsbackend.exception.BasicException;
import cn.com.cig.cigrsbackend.exception.NotLoginException;
import cn.com.cig.cigrsbackend.model.dobj.UserDO;
import cn.com.cig.cigrsbackend.service.UserService;
import cn.com.cig.cigrsbackend.utils.JwtTokenUtils;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 用来校验请求头中的jwt是否有效，以此为依据来认证用户是否登录
 * @author tanwubo
 */
@Slf4j
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenUtils jwtTokenUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        log.info("processing authentication for [{}]", request.getRequestURI());
        String token = request.getHeader(ConstantEnum.AUTHORIZATION.getValue());
        String openid = null;
        if (token != null) {
            try {
                openid = jwtTokenUtils.getOpenIdFromToken(token);
            } catch (IllegalArgumentException e) {
                log.error("an error occurred during getting openid from token", e);
                throw new BasicException(ExceptionEnum.NOT_LOGIN.customMessage("an error occurred during getting username from token , token is [%s]", token));
            } catch (ExpiredJwtException e) {
                log.warn("the token is expired and not valid anymore", e);
                throw new BasicException(ExceptionEnum.NOT_LOGIN.customMessage("the token is expired and not valid anymore, token is [%s]", token));
            }catch (SignatureException e) {
                log.warn("JWT 签名无效！token: [{}]", token);
                throw new BasicException(ExceptionEnum.NOT_LOGIN.customMessage("签名无效，请重新登录！"));
            }
        }else {
            log.info("couldn't find token string");
        }
        if (openid != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            log.debug("security context was null, so authorizing user");
            UserDO user = userService.findUserByOpenId(openid);
            if(user == null){
                throw new NotLoginException(ExceptionEnum.NOT_LOGIN);
            }
            log.info("authorized user [{}], setting security context", user);
            log.info("user：[{}]的token为：[{}]",user.getNickName(),token);
            SecurityContextHolder.getContext().setAuthentication(new WxAppletAuthenticationToken(user));
        }
        filterChain.doFilter(request, response);
    }
}
