package cn.com.cig.cigrsbackend.model.dto;

import lombok.Data;

@Data
public class LoginResultDTO {
    private String openid;
    private String sessionKey;
    private String errcode;
    private String errmsg;
}
