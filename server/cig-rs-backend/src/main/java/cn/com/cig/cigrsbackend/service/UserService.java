package cn.com.cig.cigrsbackend.service;

import cn.com.cig.cigrsbackend.constants.ScoreDetailTypeEnum;
import cn.com.cig.cigrsbackend.model.dobj.InvitationDO;
import cn.com.cig.cigrsbackend.model.dobj.UserDO;
import cn.com.cig.cigrsbackend.model.vo.CommonParam;
import cn.com.cig.cigrsbackend.model.vo.InvitationVO;
import cn.com.cig.cigrsbackend.model.vo.UserVO;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

/**
* @Description: user 服务接口
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/21
*/
public interface UserService {


    /**
    * @Description: 通过openId查找用户
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/21
    */
    UserDO findUserByOpenId(String openId);

    /**
     * @Description: 通过openId查找用户
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/21
     */
    UserVO findUserByUserId(Long userId);

    /**
    * @Description: 查询用户积分
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/14
    */
    Long findUserScore(Long userId);


    /**
    * @Description: 用户注册
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/21
    */
    UserDO register(UserDO user);

    /**
    * @Description: 根据传入的userId判断这个用户是否签到
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/23
    */
    Boolean isSignInByUserId(Long userId);


    /**
    * @Description: 用户签到
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/23
    */
    UserVO signIn(Long userId);

    /**
    * @Description: 邀请用户
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/24
    */
    InvitationVO invitedUser(Long fromUserId,Long toUserID);

    /**
    * @Description: 用户收藏列表
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/24
    */
    Map<String, Object> findUserCollectList(Long userId);

    /**
     * @Description: 用户报告下载列表
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/24
     */
    Map<String, Object> findUserDownloadList(Long userId);

    /**
    * @Description: 根据userId修改用户信息
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/15
    */
    void updateUserbyid(CommonParam param);

    /**
    * @Description: 根据用户id给用户加积分
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/15
    */
    void addScoreByUserId(Long userId , ScoreDetailTypeEnum scoreDetailTypeEnum);
    
    /**
    * @Description: 浏览报告、浏览视频、分享小程序加经验，因为一天之内的分享只有前两次加分，所以需要新加一个方法来添加逻辑
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/15
    */
    void otherAddScoreByUserId(CommonParam param);

    /**
    * @Description: 查询用户的积分明细
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/19
    */
    Map<String, Object> getUserScoreDetail(Long userId);


    /**
     * @Description: 判断token是否有效
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/10/19
     */
    Map<String, Object> judgeTokenIsOk(String token);





}