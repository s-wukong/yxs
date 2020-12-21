package cn.com.cig.cigrsbackend.model.dto;

import lombok.Data;

@Data
public class WxAccessTokenDTO {
    private String access_token;
    private String expires_in;
    private String errcode;
    private String errmsg;
}
