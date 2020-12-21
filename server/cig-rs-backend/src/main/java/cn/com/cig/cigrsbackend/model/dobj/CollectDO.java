package cn.com.cig.cigrsbackend.model.dobj;

import lombok.Data;
import lombok.ToString;

/**
* @Description: app_user_collect对应的实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/27
*/
@Data
@ToString
public class CollectDO {

    private Long id;
    private Long userId;
    private Long contentId;
    private String contentType;
    private Long collectTime;
}