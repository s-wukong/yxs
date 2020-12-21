package cn.com.cig.cigrsbackend.security;

import cn.com.cig.cigrsbackend.model.dobj.UserDO;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
* @Description: 用于微信登录的
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/21
*/
@Getter
@Setter
public class WxAppletAuthenticationToken extends AbstractAuthenticationToken {

   private String encryptedData;
   private String iv;
   private String openid;
   private String sessionKey;
   private String rawData;
   private String signature;
   private UserDO user;
   private String sourceUserId;
   private String platform;



    public WxAppletAuthenticationToken(String openid, String encryptedData, String iv, String sessionKey,String sourceUserId,String platform) {
        super(null);
        this.openid = openid;
        this.sessionKey = sessionKey;
        this.encryptedData = encryptedData;
        this.iv = iv;
        this.sourceUserId = sourceUserId;
        this.platform = platform;
    }

    public WxAppletAuthenticationToken(String openid, String sessionKey, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.openid = openid;
        this.sessionKey = sessionKey;
        super.setAuthenticated(true);
    }

    public WxAppletAuthenticationToken(UserDO user) {
        super(null);
        this.user = user;
        super.setAuthenticated(true);
    }

    public WxAppletAuthenticationToken(String openid, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.openid = openid;
        super.setAuthenticated(true);
    }

    public Object getCredentials() {
        return this.openid;
    }

    public Object getPrincipal() {
        return this.sessionKey;
    }

    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        if (isAuthenticated) {
            throw new IllegalArgumentException(
                    "Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead");
        }

        super.setAuthenticated(false);
    }

    @Override
    public void eraseCredentials() {
        super.eraseCredentials();
    }


}
