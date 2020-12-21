package cn.com.cig.cigrsbackend.constants;

import java.util.LinkedHashMap;
import java.util.Map;

public class ScoreLevelConstant {
    //存放着用户等级对应着上限
    public static final Map<Integer,Long> userLevelScore= new LinkedHashMap<>();
    public static final Map<Integer,Long> userLevelScoreCeiling= new LinkedHashMap<>();
    static {
        userLevelScore.put(0,0L);
        userLevelScore.put(1,50L);
        userLevelScore.put(2,300L);
        userLevelScore.put(3,2000L);

        userLevelScoreCeiling.put(0,50L);
        userLevelScoreCeiling.put(1,300L);
        userLevelScoreCeiling.put(2,2000L);
        userLevelScoreCeiling.put(3,9999L);
    }

    /**
    * @Description: 传入积分，判断等级
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/14
    */
    public static Integer getUserlevelByScore(Long score){
        if(score == null){
            return 0;
        }
        Integer level = 0;
        for(Map.Entry<Integer,Long> entry:userLevelScore.entrySet()){
            if(score >= entry.getValue()){
                level = entry.getKey();
            }
        }
        return level;
    }
}