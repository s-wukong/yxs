package cn.com.cig.cigrsbackend.model.dobj;

import lombok.Data;

/**
* @Description: 响应前端积分明细对象对应的实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/10/19
*/
@Data
public class ScoreDetailDO {
     private Long detailId;
     private Long userId;
     private Integer scoreType;
     private String scoreDesc;
     private Long score;
     private Long scoreTime;
}