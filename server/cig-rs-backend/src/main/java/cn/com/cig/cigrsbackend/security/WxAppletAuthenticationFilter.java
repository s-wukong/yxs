package cn.com.cig.cigrsbackend.security;


import cn.com.cig.cigrsbackend.exception.ExceptionEnum;
import cn.com.cig.cigrsbackend.exception.BasicException;
import cn.com.cig.cigrsbackend.exception.ParamException;
import cn.com.cig.cigrsbackend.model.dto.LoginResultDTO;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.web.client.RestTemplate;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 用于用户认证的filter，但是真正的认证逻辑会委托给{@link WxAppletAuthenticationManager}
 * @author tanwubo
 */
@Slf4j
public class WxAppletAuthenticationFilter extends AbstractAuthenticationProcessingFilter {

    @Value("${wx.appid}")
    private String wxAppid;
    @Value("${wx.appsecret}")
    private String wxAppsecret;
    @Value("${wx.authurl}")
    private String wxAuthUrl;

    @Value("${bd.appid}")
    private String bdAppid;
    @Value("${bd.appsecret}")
    private String bdAppsecret;
    @Value("${bd.authurl}")
    private String bdAuthUrl;

    @Value("${dy.appid}")
    private String dyAppid;
    @Value("${dy.appsecret}")
    private String dyAppsecret;
    @Value("${dy.authurl}")
    private String dyAuthUrl;

    @Autowired
    private RestTemplate restTemplate;

    public WxAppletAuthenticationFilter(String defaultFilterProcessesUrl) {
        super(defaultFilterProcessesUrl);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws AuthenticationException, IOException, ServletException {
        String code = httpServletRequest.getParameter("code");
        String platform = httpServletRequest.getParameter("platform");
        log.info("用户开始登录啦！code:[{}],platform:[{}]",code,platform);
        if(StringUtils.isBlank(code)){
            log.error("code is null");
            throw new ParamException(ExceptionEnum.PARAM_EXCEPTION.customMessage("code is null"));
        }
        if(StringUtils.isBlank(platform)){
            log.error("platform is null");
            throw new ParamException(ExceptionEnum.PARAM_EXCEPTION.customMessage("platform is null"));
        }
        String encryptedData = httpServletRequest.getParameter("encryptedData");
        String iv = httpServletRequest.getParameter("iv");
        //用来判断登录用户是不是被推荐过来的，这个sourceUserId是推荐用户的ID
        String sourceUserId = httpServletRequest.getParameter("sourceUserId");

        LoginResultDTO loginResult = new LoginResultDTO();
        if("weapp".equals(platform)){
            loginResult = getWxLoginResultDTO(wxAuthUrl,wxAppid,wxAppsecret,code);
        }
        if("swan".equals(platform)){
            Map<String, Object> parameterMap = new HashMap<>();
            parameterMap.put("client_id",bdAppid);
            parameterMap.put("sk",bdAppsecret);
            parameterMap.put("code",code);
            String res = HttpUtil.post(bdAuthUrl, parameterMap);
            log.debug("code 获取sessionKey和openID 的结果: [{}]", res);
            loginResult = getOtherLoginResultDTO(res);
        }
        if(platform.contains("tt")){
            Map<String, Object> parameterMap = new HashMap<>();
            parameterMap.put("appid",dyAppid);
            parameterMap.put("secret",dyAppsecret);
            parameterMap.put("code",code);
            String res = HttpUtil.get(dyAuthUrl, parameterMap);
            log.debug("code 获取sessionKey和openID 的结果: [{}]", res);
            loginResult = getOtherLoginResultDTO(res);
        }
        if(loginResult.getOpenid() == null && loginResult.getSessionKey() == null){
            log.error("通过code获取sessionKey和openId失败, 详细：[{}]", loginResult);
            throw new BasicException(ExceptionEnum.WX_AUTH_FAILED.customMessage("通过code获取sessionKey和openId失败"));
        }
        log.info("通过code获取sessionKey和openId: [{}]", loginResult);
        return this.getAuthenticationManager().authenticate(new WxAppletAuthenticationToken(loginResult.getOpenid(), encryptedData , iv , loginResult.getSessionKey() , sourceUserId ,platform));
    }

    /**
    * @Description: 微信获取openid
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/29
    */
    private LoginResultDTO getWxLoginResultDTO(String code2SessionUrl, String appId, String appSecret , String code) {
        String url = String.format(code2SessionUrl, appId, appSecret, code);
        String res = HttpUtil.get(url);
        LoginResultDTO loginResultDTO = getOtherLoginResultDTO(res);
        log.info("code 获取sessionKey和openID 的 url: [{}]", url);
        return loginResultDTO;
    }

    /**
    * @Description: 抖音、百度获取openid
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/29
    */
    private LoginResultDTO getOtherLoginResultDTO(String res) {
        LoginResultDTO loginResultDTO = new LoginResultDTO();
        String openid = JSONUtil.parseObj(res).getStr("openid");
        String sessionKey = JSONUtil.parseObj(res).getStr("session_key");
        loginResultDTO.setOpenid(openid);
        loginResultDTO.setSessionKey(sessionKey);
        return loginResultDTO;
    }

}
