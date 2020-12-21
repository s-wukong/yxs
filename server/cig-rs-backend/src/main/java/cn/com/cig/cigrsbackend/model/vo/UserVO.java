package cn.com.cig.cigrsbackend.model.vo;

import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.constants.ScoreLevelConstant;
import cn.com.cig.cigrsbackend.model.dobj.UserDO;
import cn.hutool.core.date.DateUtil;
import com.vdurmont.emoji.EmojiParser;
import lombok.Data;
import lombok.ToString;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
* @Description: 与返回给前端的用户数据一一对应的实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/22
*/
@ToString
@Data
public class UserVO {
    
    private Long userId;
    private String openId;
    private String nickName;
    private String username;
    private String avatarUrl;
    private String company;
    private String position;
    private String phoneNumber;
    private String email;
    private String lastSignInTime;
    private List<Long> score;
    private Boolean isSignIn;
    private Integer userLevel;

    /**
    * @Description: 与数据库表一一对应的UserDo转为返给前端的UserVo
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/22
    */
    public static UserVO UserDOToUserVo(UserDO userDO){
        UserVO userVO = new UserVO();
        userVO.setUserId(userDO.getUserId());
        userVO.setOpenId(userDO.getOpenId());
        userVO.setNickName(userDO.getNickName()== null?ConstantEnum.EMPTYSTRING.getValue():EmojiParser.parseToUnicode(userDO.getNickName()));
        userVO.setLastSignInTime(DateUtil.date(userDO.getLastLoginTime()).toString());
        userVO.setAvatarUrl(userDO.getAvatarUrl());
        userVO.setScore(userDO.getScore()== null? Arrays.asList(0L,0L):Arrays.asList(userDO.getScore(), ScoreLevelConstant.userLevelScoreCeiling.get(userDO.getUserLevel())));
        userVO.setUsername(userDO.getUserName() == null?ConstantEnum.EMPTYSTRING.getValue():userDO.getUserName());
        userVO.setCompany(userDO.getCompany() == null ? ConstantEnum.EMPTYSTRING.getValue() : userDO.getCompany());
        userVO.setPosition(userDO.getPosition() == null ? ConstantEnum.EMPTYSTRING.getValue() : userDO.getPosition());
        userVO.setPhoneNumber(userDO.getPhoneNumber() == null ? ConstantEnum.EMPTYSTRING.getValue() : userDO.getPhoneNumber());
        userVO.setEmail(userDO.getEmail() == null ? ConstantEnum.EMPTYSTRING.getValue() : userDO.getEmail());
        return userVO;
    }
    
}