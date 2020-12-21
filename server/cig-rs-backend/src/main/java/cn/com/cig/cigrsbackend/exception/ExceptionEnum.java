package cn.com.cig.cigrsbackend.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ExceptionEnum {
    PARAM_EXCEPTION(40001, "param exception", "Wrong request parameter"),
    NOT_LOGIN(40301, "authentication exception", "not log in"),
    ACCESS_DENIED(40302, "authentication exception", "access denied, insufficient permission"),
    SIGN_INVALID(403004, "authentication exception", "signature is invalid"),
    JWT_EXCEPTION(40305, "authentication exception", "jwt exception"),
    SERVER_EXCEPTION(50000, "server exception", "Please define your own exception information"),
    WX_AUTH_FAILED(50002, "wx auth exception", "wx auth failed"),
    JSON_PARSE_EXCEPTION(50003, "json parse", "json parse failed"),
    NO_DATA(200,"normal","no data"),
    USER_LEVEL_DENIED(60301,"user download","邀请好友注册，提升等级免费下载"),
    PLATFORM_DENIED(60301,"user download","暂未开放，敬请期待～"),
    DOWNLOAD_WEEK_CEILING(60302,"user download","您本周已下载2份报告，再邀请5名好友解锁无限下载权限"),
    DOWNLOAD_DAY_CEILING(60303,"user download","今日已达下载上限");

    private Integer status;
    private String type;
    private String message;

    public ExceptionEnum customMessage(String message){
        this.message = message;
        return this;
    }

    public ExceptionEnum customMessage(String message, Object...args){
        this.message = String.format(message, args);
        return this;
    }
}
