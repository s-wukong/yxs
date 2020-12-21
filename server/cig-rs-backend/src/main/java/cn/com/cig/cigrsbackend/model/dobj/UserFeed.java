package cn.com.cig.cigrsbackend.model.dobj;

import lombok.Data;
import lombok.ToString;

/**
* @Description: 用户反馈表，对应app_user_feed
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/24
*/
@Data
@ToString
public class UserFeed {

    private Long id;
    private Long userId;
    private Long contentId;
    private Integer contentType;
    private Integer feedType;
    private Long feedTime;
    private Long beginTime;
    private Long endTime;
}