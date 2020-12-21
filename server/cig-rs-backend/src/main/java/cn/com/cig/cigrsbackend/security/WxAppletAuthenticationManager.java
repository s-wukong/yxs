package cn.com.cig.cigrsbackend.security;

import cn.com.cig.cigrsbackend.dao.UserDao;
import cn.com.cig.cigrsbackend.exception.ExceptionEnum;
import cn.com.cig.cigrsbackend.exception.BasicException;
import cn.com.cig.cigrsbackend.model.dobj.UserDO;
import cn.com.cig.cigrsbackend.security.handler.CustomAuthenticationSuccessHandler;
import cn.com.cig.cigrsbackend.service.UserService;
import cn.com.cig.cigrsbackend.utils.WxUtil;
import cn.hutool.json.JSONObject;
import com.vdurmont.emoji.EmojiParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;

import static cn.com.cig.cigrsbackend.constants.ScoreDetailTypeEnum.INVITATIONNEWUSER;
import static cn.com.cig.cigrsbackend.constants.ScoreDetailTypeEnum.getScoreDetailTypeEnumByScoreType;


/**
* @Description: 真正执行认证逻辑的manager, {@link WxAppletAuthenticationFilter}会将认证委托给{@link WxAppletAuthenticationManager}来做
 *              成功后进入{@link CustomAuthenticationSuccessHandler}
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/22
*/
@Component
@Slf4j
public class WxAppletAuthenticationManager implements AuthenticationManager {
    @Autowired
    private UserService userService;

    @Autowired
    private UserDao userDao;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        WxAppletAuthenticationToken wxAppletAuthenticationToken = null;
        if (authentication instanceof WxAppletAuthenticationToken) {
            wxAppletAuthenticationToken = (WxAppletAuthenticationToken) authentication;
        }
        log.info("start query user.........");
        UserDO user = userService.findUserByOpenId(wxAppletAuthenticationToken.getOpenid());
        log.info("end query user :[{}]",user);
        //执行注册逻辑
        if (user == null) {
            log.info("用户不存在，开始注册. openid is [{}]", wxAppletAuthenticationToken.getOpenid());
            user = new UserDO();
            user.setOpenId(wxAppletAuthenticationToken.getOpenid());
            user.setPlatform(wxAppletAuthenticationToken.getPlatform());
            user = userService.register(user);
            log.info("注册的用户为： [{}]", user);
            //如果推荐用户id不为空的话，给推荐用户加经验
            if(wxAppletAuthenticationToken.getSourceUserId() != null){
                userService.invitedUser(Long.parseLong(wxAppletAuthenticationToken.getSourceUserId()), user.getUserId());
                userService.addScoreByUserId(Long.parseLong(wxAppletAuthenticationToken.getSourceUserId()),INVITATIONNEWUSER);
                log.info("推荐用户的userId:[{}]",wxAppletAuthenticationToken.getSourceUserId());
            }
            return new WxAppletAuthenticationToken(user);

        }//解密用户信息，保存在对应的openID中
        else {
            log.info("用户存在！！！");
            if(wxAppletAuthenticationToken.getEncryptedData() != null && wxAppletAuthenticationToken.getIv() != null){
                //获取用户信息
                JSONObject userInfo = WxUtil.getUserInfo(wxAppletAuthenticationToken.getEncryptedData(), wxAppletAuthenticationToken.getSessionKey(), wxAppletAuthenticationToken.getIv());
                if(userInfo == null){
                    log.error("解密用户数据失败");
                    throw new BasicException(ExceptionEnum.SIGN_INVALID.customMessage("encryptedData is invalid"));
                }
                log.info("根据openID，更新用户信息，openID:[{}]",userInfo.getStr("openId"));
                log.info("解密后的用户数据是：[{}]",userInfo);
                //更新用户的头像和昵称和最后一次登录时间
                user.setUnionId(userInfo.getStr("unionId"));
                user.setNickName(EmojiParser.parseToHtmlDecimal(userInfo.getStr("nickName")));
                user.setAvatarUrl(userInfo.getStr("avatarUrl"));
                userDao.updateUserWxInfo(user);
            }else {
                //记录用户最后一次登录时间
                userDao.updateUserLastLoginTime(user.getUserId(),System.currentTimeMillis());
            }


        }
        return new WxAppletAuthenticationToken(user);
    }

}
