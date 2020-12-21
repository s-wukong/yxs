package cn.com.cig.cigrsbackend.utils;

import cn.com.cig.cigrsbackend.model.dobj.UserFeed;

import static cn.com.cig.cigrsbackend.constants.ConstantEnum.VIDEOCONTENTTYPE;
import static cn.com.cig.cigrsbackend.utils.ParamCheckUtils.checkUserIdAndContentId;

public class ReportAndVideoUitl {

    private ReportAndVideoUitl(){

    }
    /**
     * @Description: 获取描述用户关于某内容反馈的实体类
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/29
     */
    public static UserFeed getUserFeed(Long userId, Long contentId , String contentType, String feedType) {
        UserFeed userFeed = new UserFeed();
        userFeed.setUserId(userId);
        userFeed.setContentId(contentId);
        userFeed.setContentType(Integer.parseInt(contentType));
        userFeed.setFeedType(Integer.parseInt(feedType));
        userFeed.setFeedTime(CigDateUtil.currentTimeStamp());
        return userFeed;
    }
}