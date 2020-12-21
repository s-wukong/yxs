package cn.com.cig.cigrsbackend.model.vo;

import cn.com.cig.cigrsbackend.model.dobj.ScoreDetailDO;
import cn.hutool.core.date.DateUtil;
import lombok.Data;

/**
* @Description: 响应前端积分明细对象对应的实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/10/19
*/
@Data
public class ScoreDetailVO {
     private Long detailId;
     private String scoreDesc;
     private String scoreDate;
     private String score;

     public static ScoreDetailVO doTurnVO(ScoreDetailDO scoreDetailDO){
          ScoreDetailVO scoreDetailVO = new ScoreDetailVO();
          scoreDetailVO.setDetailId(scoreDetailDO.getDetailId());
          scoreDetailVO.setScoreDesc(scoreDetailDO.getScoreDesc());
          scoreDetailVO.setScoreDate(DateUtil.date(scoreDetailDO.getScoreTime()).toDateStr());
          scoreDetailVO.setScore(scoreDetailDO.getScore() > 0?"+"+scoreDetailDO.getScore():"-"+scoreDetailDO.getScore());
          return scoreDetailVO;
     }
}