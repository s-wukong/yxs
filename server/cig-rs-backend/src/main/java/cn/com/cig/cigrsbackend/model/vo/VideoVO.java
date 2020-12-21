package cn.com.cig.cigrsbackend.model.vo;

import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.model.dobj.VideoDO;
import cn.hutool.core.date.DateUtil;
import lombok.Data;
import lombok.ToString;

import static cn.com.cig.cigrsbackend.utils.CigDateUtil.getDurationString;

/**
 * @Description: 响应前端视频对象对应的实体类
 * @Author: liushilei
 * @Version: 1.0
 * @Date: 2020/9/24
 */
@ToString
@Data
public class VideoVO {

    private Long id;
    private String title;
    private String speaker;
    private String uploadDate;
    private String bannerUrl;
    private String duration;

    private Long viewCounts;
    private Long likeCounts;
    private String collectTime;
    private String synopsis;
    private String videoLink;
    private Boolean isCollect;


    public static VideoVO videoDOToVideoVO(VideoDO videoDO,String cdhPrefix){
        VideoVO videoVO = new VideoVO();
        videoVO.setId(videoDO.getVideoId());
        videoVO.setTitle(videoDO.getTitle() == null?ConstantEnum.EMPTYSTRING.getValue():videoDO.getTitle());
        videoVO.setSpeaker(videoDO.getSpeaker() == null?ConstantEnum.EMPTYSTRING.getValue():videoDO.getSpeaker());
        videoVO.setUploadDate(videoDO.getUploadTime() == null? ConstantEnum.EMPTYSTRING.getValue():DateUtil.date(videoDO.getUploadTime()).toDateStr());
        videoVO.setBannerUrl(videoDO.getBannerUrl() == null?ConstantEnum.EMPTYSTRING.getValue():cdhPrefix + videoDO.getBannerUrl());
        if(videoDO.getDuration() == null){
            videoDO.setDuration(ConstantEnum.EMPTYSTRING.getValue());
        }else {
            videoVO.setDuration(getDurationString(videoDO.getDuration()));
        }
        return videoVO;
    }
}