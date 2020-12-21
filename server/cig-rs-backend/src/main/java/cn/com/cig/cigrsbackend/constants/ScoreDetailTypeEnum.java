package cn.com.cig.cigrsbackend.constants;

import cn.com.cig.cigrsbackend.exception.BasicException;
import cn.com.cig.cigrsbackend.exception.ExceptionEnum;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.EnumUtils;

@AllArgsConstructor
@Getter
@Slf4j
public enum ScoreDetailTypeEnum {
    SINGIN(1,"每日签到",10L),
    SUPPLEMENTUSERNAME(11,"完善姓名",2L),
    SUPPLEMENTPHONE(12,"完善手机号",2L),
    SUPPLEMENTCOMPANY(13,"完善公司",2L),
    SUPPLEMENTPOSITION(14,"完善职务",2L),
    SUPPLEMENTEMAIL(15,"完善邮箱",2L),
    INVITATIONNEWUSER(16,"推荐新用户",50L),
    SHARE(20,"分享",5L),
    SHAREVIDEO(21,"分享视频",5L),
    SHAREREPORT(23,"分享报告",5L),
    SHAREWXAPPLICATION(22,"分享小程序",5L),
    VIEWREPORT(31,"浏览报告",2L),
    VIEWVIDEO(32,"浏览视频",5L),
    LIKE(41,"点赞",1L),
    COLLECT(42,"收藏",1L),
    DOWNLOAD(43,"下载",2L);

    private Integer scoreType;
    private String scoreDesc;
    private Long score;


    public static ScoreDetailTypeEnum getScoreDetailTypeEnumByScoreType(Integer scoreType){
        for(ScoreDetailTypeEnum scoreDetailTypeEnum : ScoreDetailTypeEnum.values()){
            if(scoreDetailTypeEnum.getScoreType().equals(scoreType)){
                return scoreDetailTypeEnum;
            }
        }
        log.info("积分类型错误，socreType:[{}]",scoreType);
        throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("积分类型错误！"));
    }

}

