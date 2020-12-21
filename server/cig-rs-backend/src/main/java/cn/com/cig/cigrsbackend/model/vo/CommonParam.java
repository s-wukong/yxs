package cn.com.cig.cigrsbackend.model.vo;

import lombok.Data;
import lombok.ToString;

/**
* @Description: 前端传入参数映射实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/24
*/
@Data
@ToString
public class CommonParam {
    private Long userId;
    private Long videoId;
    private Long fromUserId;//邀请人
    private Long toUserId;//被邀请人
    private String commentContent;
    private Boolean isCollect;//为true则为收藏视频，false则为取消收藏
    private String searchWord;
    private Long reportId;
    private String username;
    private String company;
    private String position;
    private String phoneNumber;
    private String email;
    private Long scoreType;
    private String token;
    private String platform;
}