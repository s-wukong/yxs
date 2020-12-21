package cn.com.cig.cigrsbackend.security.handler;

import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.dao.UserDao;
import cn.com.cig.cigrsbackend.model.dobj.UserDO;
import cn.com.cig.cigrsbackend.model.vo.UserVO;
import cn.com.cig.cigrsbackend.security.WxAppletAuthenticationToken;
import cn.com.cig.cigrsbackend.service.UserService;
import cn.com.cig.cigrsbackend.utils.JwtTokenUtils;
import cn.com.cig.cigrsbackend.utils.RestResultGenerator;
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.http.ContentType;
import cn.hutool.json.JSONUtil;
import com.vdurmont.emoji.EmojiParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

import static cn.com.cig.cigrsbackend.constants.ScoreLevelConstant.getUserlevelByScore;

/**
* @Description: 用户认证通过handler
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/22
*/
@Slf4j
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtTokenUtils jwtTokenUtils;

    @Autowired
    private UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Authentication authentication) throws IOException, ServletException {
        UserDO userDO = ((WxAppletAuthenticationToken)authentication).getUser();
        // 使用jwt管理，所以封装用户信息生成jwt响应给前端
        String token = jwtTokenUtils.generateToken(((WxAppletAuthenticationToken)authentication).getUser().getOpenId());
        Long score = userService.findUserScore(userDO.getUserId());
        userDO.setScore(score);
        UserVO userVO = UserVO.UserDOToUserVo(userDO);
        userVO.setUserLevel(getUserlevelByScore(score));
        if(userDO.getNickName() != null){
            userVO.setNickName(EmojiParser.parseToUnicode(userDO.getNickName()));
        }
        Map<String, Object> result = BeanUtil.beanToMap(userVO,false,true);
        result.put(ConstantEnum.AUTHORIZATION.getValue(), token);
        log.info("该用户登录成功: [{}]", result);
        log.info(JSONUtil.toJsonStr(RestResultGenerator.getRestSuccessResult(result)));
        httpServletResponse.setContentType(ContentType.JSON.toString());
        httpServletResponse.getWriter().write(JSONUtil.toJsonStr(RestResultGenerator.getRestSuccessResult(result)));
    }
}
