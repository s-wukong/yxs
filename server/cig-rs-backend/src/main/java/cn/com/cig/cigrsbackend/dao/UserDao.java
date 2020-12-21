package cn.com.cig.cigrsbackend.dao;


import cn.com.cig.cigrsbackend.model.dobj.*;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
* @Description: 用户模块的DAO层
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/16
*/
public interface UserDao {

    /**
    * @Description: 查询所有用户
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/18
    */
    @Select("select * from app_user")
    List<UserDO> findAllUser();


    /**
    * @Description: 添加用户
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/18
    */
    @Insert("insert into app_user(open_id," +
            "union_id," +
            "user_name," +
            "nick_name," +
            "avatar_url," +
            "company," +
            "position,phone_number,email,user_level,registration_time,last_login_time,platform)" +
            "values(#{openId}," +
            "#{unionId}," +
            "#{userName}," +
            "#{nickName}," +
            "#{avatarUrl}," +
            "#{company}," +
            "#{position},#{phoneNumber},#{email},#{userLevel},#{registrationTime},#{lastLoginTime},#{platform})")
    @Options(useGeneratedKeys=true,keyProperty="userId")
    int addUser(UserDO user);

    /**
    * @Description: 根据userId查找用户
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/18
    */
    @Select("select * from app_user where user_id = #{userId}")
    UserDO findUserByUserId(Long userId);



    /**
     * @Description: 根据openId查找用户
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/18
     */
    @Select("select * from app_user where open_id = #{openId}")
    UserDO findUserByOpenId(String openId);

    /**
    * @Description: 修改user信息
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/18
    */
    @Update("update app_user set user_name = #{userName}," +
            "nick_name = #{nickName}," +
            "avatar_url = #{avatarUrl}," +
            "company = #{company}," +
            "position = #{position}," +
            "phone_number = #{phoneNumber}," +
            "email = #{email}," +
            "last_login_time = #{lastLoginTime} where user_id = #{userId}"
    )
    int updateUserByUserId(UserDO user);

    /**
    * @Description: 更新用户最后一次登录时间
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/18
    */
    @Update("update app_user set last_login_time = #{lastLoginTime} where user_id = #{userId}")
    int updateUserLastLoginTime(Long userId,Long lastLoginTime);

    /**
     * @Description: 根据openID修改用户头像和昵称
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/18
     */
    @Update("update app_user set last_login_time = #{lastLoginTime}," +
            "nick_name = #{nickName}," +
            "avatar_url = #{avatarUrl}," +
            "union_id = #{unionId}," +
            "last_login_time = #{lastLoginTime} where open_id = #{openId}")
    int updateUserWxInfo(UserDO userDO);

    /**
    * @Description: 查询用户的积分
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/23
    */
    @Select("select sum(score) from app_user_score where user_id = #{userId}")
    Long findScoreByUserId(Long userId);

    /**
    * @Description: 添加积分记录
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/14
    */
    @Insert("insert into app_user_score(user_id," +
            "score_type," +
            "score_desc," +
            "score," +
            "score_time)" +
            "values(#{userId}," +
            "#{scoreType}" +
            ",#{scoreDesc}," +
            "#{score}," +
            "#{scoreTime})")
    @Options(useGeneratedKeys=true,keyProperty="detailId")
    int addScoreRecord(ScoreDO scoreDO);

    /**
    * @Description: 用户签到
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/23
    */
    @Select("select score_time from app_user_score where user_id = #{userId} " +
            "and score_type = #{scoreType} order by score_time desc limit 1")
    Long findLastScoreActivityTimeByUserId(Long userId,Integer scoreType);

    @Insert("insert into app_user_score(user_id," +
            "score_type," +
            "score," +
            "score_time)" +
            "values(#{userId}," +
            "#{scoreType}," +
            "#{score}," +
            "#{scoreTime})")
    @Options(useGeneratedKeys=true,keyProperty="detailId")
    int addUserSignIn(ScoreDO score);


    /**
    * @Description: 添加邀请成功记录
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/24
    */
    @Insert("insert into app_user_invitation(from_user_id," +
            "to_user_id," +
            "invitation_date)"+
            "values(#{fromUserId}," +
            "#{toUserId}," +
            "#{invitationDate})")
    @Options(useGeneratedKeys=true,keyProperty="id")
    int addInvitationRecord(InvitationDO invitationDO);

    /**
    * @Description: 查询用户的收藏的所有视频
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/24
    */
    @Select("SELECT a.*, temp.collect_time " +
            "FROM app_video a " +
            "JOIN (SELECT content_id,collect_time " +
                  "FROM app_user_collect " +
                  "WHERE user_id = #{userId} AND content_type = #{contentType}) AS temp " +
            "ON a.video_id = temp.content_id")
    List<VideoDO> findCollectVideoListByUserId(Long userId,String contentType);

    /**
     * @Description: 查询用户关某视内容的收藏记录，这里内容是指视频和pdf
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/25
     */
    @Select("select count(1) from app_user_collect where " +
            "user_id = #{userId} and content_type = #{contentType} and content_id = #{contentId}")
    int findCollectCountByUserIdAndContent(Long userId, String contentType, Long contentId);

    /**
    * @Description: 查看用户在时间区间中收藏了多少次
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/14
    */
    @Select("select count(1) from app_user_collect where " +
            "user_id = #{userId} and collect_time > #{beginTime} and collect_time < #{endTime}")
    int findCollectCountAtTime(Long userId,Long beginTime,Long endTime);

    /**
     * @Description: 查询用户的收藏的所有报告
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/24
     */
    @Select("SELECT a.*, temp.collect_time " +
            "FROM app_report a " +
            "JOIN (SELECT content_id,collect_time " +
            "FROM app_user_collect " +
            "WHERE user_id = #{userId} AND content_type = #{contentType}) AS temp " +
            "ON a.id = temp.content_id")
    List<ReportDO> findCollectReportListByUserId(Long userId,String contentType);

    /**
    * @Description: 查询用户下载的所有报告
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/15
    */
    @Select("SELECT a.*, temp.download_time " +
            "FROM app_report a " +
            "JOIN (SELECT report_id,download_time " +
            "FROM app_report_download " +
            "WHERE user_id = #{userId}) AS temp " +
            "ON a.id = temp.report_id")
    List<ReportDO> findDownloadReportListByUserId(Long userId);

    /**
     * @Description: 添加收藏记录
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/27
     */
    @Insert("insert into app_user_collect(user_id,content_id,content_type,collect_time) " +
            "values(#{userId},#{contentId},#{contentType},#{collectTime})")
    @Options(useGeneratedKeys=true,keyProperty="id")
    int addCollectRecord(CollectDO collectDO);

    /**
     * @Description: 删除收藏记录
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/27
     */
    @Delete("delete from app_user_collect " +
            "where user_id = #{userId} and content_type = #{contentType} and content_id = #{contentId}")
    int deleteCollectRecord(CollectDO collectDO);

    /**
     * @Description: 添加反馈记录，这里的反馈有观看、点赞、分享
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/24
     */
    @Insert("insert into app_user_feed(user_id,content_id,content_type,feed_type,feed_time) " +
            "values(#{userId},#{contentId},#{contentType},#{feedType},#{feedTime})")
    int addFeedRecord(UserFeed userFeed);

    /**
    * @Description: 查询用户在时间区间内关于某内容的某种反馈行为有多少次
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/14
    */
    @Select("select count(1) from app_user_feed where" +
            " user_id = #{userId} and " +
            "feed_type = #{feedType} and " +
            "feed_time > #{beginTime} and " +
            "feed_time < #{endTime}")
    int findCountUserFeedRecordAtTime(UserFeed userFeed);

    /**
     * @Description: 查询用户在时间区间内关于某内容的某种反馈行为经过去重有多少次
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/10/14
     */
    @Select("select COUNT(DISTINCT user_id,content_id,content_type,feed_type) from app_user_feed where" +
            " user_id = #{userId} and " +
            "feed_type = #{feedType} and " +
            "feed_time > #{beginTime} and " +
            "feed_time < #{endTime}")
    int findDistinctCountUserFeedRecordAtTime(UserFeed userFeed);


    /**
     * @Description: 查看内容关于某个活动的count数
     *              内容：视频、pdf
     *              活动：观看、点赞、分享
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/24
     */
    @Select("select count(1) from app_user_feed " +
            "where feed_type = #{feedType} and content_type = #{contentType} and content_id = #{contentId}")
    Long findActivityCountByContentId(Long contentId, String feedType, String contentType);


    /**
    * @Description: 根据userid查询用户的下载记录
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/12
    */
    @Select("select * from app_report_download where user_id = #{userId}")
    List<DownloadDO> findDownloadRecordByUserId(Long userId);

    /**
    * @Description: 在大于time的时间内用户关于reportId的下载记录
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/13
    */
    @Select("select * from app_report_download where user_id = #{userId} and report_id = #{reportId} and download_time > #{time}")
    List<DownloadDO> findDownloadRecordByUserIdAndReprotId(Long userId,Long reportId,Long time);

    /**
     * @Description: 在小于time的时间内用户关于reportId的下载记录
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/10/13
     */
    @Select("select * from app_report_download where user_id = #{userId} and report_id = #{reportId} and download_time < #{time}")
    List<DownloadDO> findDlRbyUidAndRidAndLessTime(Long userId,Long reportId,Long time);

    /**
     * @Description: 用户关于reportId的下载记录
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/10/13
     */
    @Select("select count(1) from app_report_download where user_id = #{userId} and report_id = #{reportId}")
    int findDownloadRecordCount(Long userId,Long reportId);

    /**
     * @Description: 在大于time的时间内用户的下载记录
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/10/13
     */
    @Select("select * from app_report_download where user_id = #{userId} and download_time > #{time}")
    List<DownloadDO> findDownloadRecordByUserIdAndTime(Long userId,Long time);

    /**
     * @Description: 添加下载记录
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/18
     */
    @Update("insert into app_report_download(user_id,report_id,download_time,download_url) " +
            "values(#{userId},#{reportId},#{downloadTime},#{downloadUrl})")
    int addDownloadRecord(DownloadDO downloadDO);

    /**
    * @Description: 查找用户关于报告当天下载记录
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/13
    */
    @Select("select * from app_report_download where user_id = #{userId} and report_id = #{reportId} " +
            "and download_time > #{beginTime} and download_time < #{endTime}")
    List<DownloadDO> findUserAboutReportAtCurrentDayDownload(Long userId,Long reportId,Long beginTime,Long endTime);

    /**
    * @Description: 修改用户等级
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/14
    */
    @Update("update app_user set user_level = #{userLevel} where user_id = #{userId}")
    int updateUserLevelByUserId(Long userId,Integer userLevel);

    @Select("select * from app_user_score where user_id=#{userId} order by score_time desc")
    List<ScoreDetailDO> findScoreDetailByUserId(Long UserId);

}
