package cn.com.cig.cigrsbackend.model.dobj;

import lombok.Data;
import lombok.ToString;

/**
* @Description: app_user表对应的实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/16
*/
@ToString
@Data
public class UserDO {

    private Long userId;   // 用户ID，自增
    private String openId; //必填，加密后的微信号，每个用户对每个公众号的OpenID是唯一的。对于不同公众号，同一用户的openid不同
    private String unionId;
    private String userName; //真实姓名
    private String nickName; //用户名
    private String avatarUrl; //用户头像
    private String company; //所属公司
    private String position; //职务
    private String phoneNumber;  //手机号码
    private String email; //邮箱',
    private Long registrationTime; //注册时间
    private Long lastLoginTime; //最后登录的时间
    private Long score; //关于用户积分
    private Integer userLevel;
    private String platform;
}