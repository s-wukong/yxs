package cn.com.cig.cigrsbackend.model.dobj;

import cn.com.cig.cigrsbackend.constants.ScoreDetailTypeEnum;
import lombok.Data;
import lombok.ToString;

/**
* @Description: 用户积分明细表对应的实体类 app_user_score
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/23
*/
@ToString
@Data
public class ScoreDO {

    private Long detailId;
    private Long userId;
    private Integer scoreType;
    private String scoreDesc;
    private Long score;
    private Long scoreTime;

    public static ScoreDO getInstance(){
        ScoreDO scoreDO = new ScoreDO();
        scoreDO.setScore(ScoreDetailTypeEnum.SINGIN.getScore());
        scoreDO.setScoreType(ScoreDetailTypeEnum.SINGIN.getScoreType());
        scoreDO.setScoreTime(System.currentTimeMillis());
        return scoreDO;
    }
}