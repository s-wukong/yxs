package cn.com.cig.cigrsbackend.model.dobj;

import lombok.Data;
import lombok.ToString;

/**
* @Description: app_video对应的实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/24
*/
@Data
@ToString
public class VideoDO {
    private Long videoId;
    private String bannerUrl;
    private String speaker;
    private String synopsis;
    private String duration;
    private String title;
    private String videoLink;
    private Long uploadTime;
    private Long orderKey;
    private Integer isHot;
    private Long collectTime;
}