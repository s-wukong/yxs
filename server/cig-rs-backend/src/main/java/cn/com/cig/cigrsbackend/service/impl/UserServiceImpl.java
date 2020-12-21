package cn.com.cig.cigrsbackend.service.impl;

import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.constants.ScoreDetailTypeEnum;
import cn.com.cig.cigrsbackend.dao.VideoDao;
import cn.com.cig.cigrsbackend.exception.ExceptionEnum;
import cn.com.cig.cigrsbackend.dao.UserDao;
import cn.com.cig.cigrsbackend.exception.BasicException;
import cn.com.cig.cigrsbackend.exception.NotLoginException;
import cn.com.cig.cigrsbackend.model.dobj.*;
import cn.com.cig.cigrsbackend.model.vo.*;
import cn.com.cig.cigrsbackend.service.UserService;
import cn.com.cig.cigrsbackend.utils.CigDateUtil;
import cn.com.cig.cigrsbackend.utils.JwtTokenUtils;
import cn.com.cig.cigrsbackend.utils.ParamCheckUtils;
import cn.hutool.core.date.DateUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.*;

import static cn.com.cig.cigrsbackend.constants.ConstantEnum.*;
import static cn.com.cig.cigrsbackend.constants.ScoreDetailTypeEnum.*;
import static cn.com.cig.cigrsbackend.constants.ScoreLevelConstant.*;
import static cn.com.cig.cigrsbackend.utils.ReportAndVideoUitl.getUserFeed;
import static java.util.stream.Collectors.toList;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private VideoDao videoDao;

    @Value("${cdn.prefix}")
    private String cdnPrefix;

    @Autowired
    private JwtTokenUtils jwtTokenUtils;

    @Override
    public UserDO findUserByOpenId(String openId) {
        ParamCheckUtils.checkParam(openId);
        UserDO userDO = userDao.findUserByOpenId(openId);
        return userDO;
    }

    @Override
    public UserVO findUserByUserId(Long userId) {
        ParamCheckUtils.checkParam(userId);
        UserDO userDO = getUserByUserIdAndCheckUser(userId);
        //查询用户积分
        Long score = findUserScore(userId);
        UserVO userVO = UserVO.UserDOToUserVo(userDO);
        userVO.setUserLevel(getUserlevelByScore(score));
        userVO.setScore(Arrays.asList(score, userLevelScoreCeiling.get(userDO.getUserLevel())));
        //查询用户是否签到
        userVO.setIsSignIn(isSignInByUserId(userId));
        return userVO;
    }

    public Long findUserScore(Long userId) {
        Long score = userDao.findScoreByUserId(userId);
        if(score == null){
            score = 0L;
        }
        //这里需要校验一下积分和等级不对等情况，如果积分和等级不对等，则更新等级
        UserDO user = userDao.findUserByUserId(userId);
        if(!user.getUserLevel().equals(getUserlevelByScore(score))){
            int sta = userDao.updateUserLevelByUserId(userId, getUserlevelByScore(score));
            if(sta <= 0){
                log.error("用户更新等级失败：" + user.toString());
                throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("给用户更新等级失败！"));
            }
        }

        return score;
    }


    /**
     * @Description: 根据userID获取user对象，如果user对象为null抛出异常
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/27
     */
    private UserDO getUserByUserIdAndCheckUser(Long userId) {
        UserDO userDO = userDao.findUserByUserId(userId);
        if(userDO == null){
            throw new BasicException(ExceptionEnum.PARAM_EXCEPTION.customMessage("该用户不存在！"));
        }
        return userDO;
    }

    @Override
    public UserDO register(UserDO user) {
        user.setRegistrationTime(System.currentTimeMillis());
        user.setLastLoginTime(System.currentTimeMillis());
        user.setUserLevel(0);
        int status = userDao.addUser(user);
        if (status <= 0){
            log.error("register failed, user is [{}]", user);
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("注册失败，用户保存错误！"));
        }
        return user;
    }

    @Override
    public Boolean isSignInByUserId(Long userId) {
        ParamCheckUtils.checkParam(userId);
        getUserByUserIdAndCheckUser(userId);
        Long lastSignInTime = userDao.findLastScoreActivityTimeByUserId(userId, ScoreDetailTypeEnum.SINGIN.getScoreType());
        if(lastSignInTime == null){
            return Boolean.FALSE;
        }
        //如果lastSignInTime是今天得时间点，说明用户已经签到了返回true，反之则为false
        return CigDateUtil.judgeTimeIsInToday(lastSignInTime);
    }

    @Override
    public UserVO signIn(Long userId) {
        ParamCheckUtils.checkParam(userId);
        getUserByUserIdAndCheckUser(userId);
        UserVO userVO = new UserVO();
        ScoreDO scoreDO = ScoreDO.getInstance();
        scoreDO.setUserId(userId);
        int status = userDao.addUserSignIn(scoreDO);
        if(status > 0){
            //查询用户积分
            Long score = userDao.findScoreByUserId(userId);
            UserDO userDO = userDao.findUserByUserId(userId);
            userVO.setUserId(userId);
            userVO.setScore(Arrays.asList(score, userLevelScore.get(userDO.getUserLevel())));
            userVO.setIsSignIn(true);
            return userVO;
        }else {
            log.error("签到失败，userId:[{}]",userId);
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("签到失败！"));
        }
    }

    @Override
    public InvitationVO invitedUser(Long fromUserId,Long toUserID) {
        ParamCheckUtils.checkParam(fromUserId);
        ParamCheckUtils.checkParam(toUserID);
        if(fromUserId.equals(toUserID)){
            throw new BasicException(ExceptionEnum.PARAM_EXCEPTION.customMessage("邀请不合法！"));
        }
        getUserByUserIdAndCheckUser(fromUserId);
        InvitationDO invitationDO = new InvitationDO();
        invitationDO.setFromUserId(fromUserId);
        invitationDO.setToUserId(toUserID);
        invitationDO.setInvitationDate(System.currentTimeMillis());
        int status = userDao.addInvitationRecord(invitationDO);
        if(status <= 0){
            log.error("添加邀请记录失败，sourceUserId:[{}],toUserId:[{}]",fromUserId,toUserID);
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("添加邀请记录失败！"));
        }
        return InvitationVO.dOToVO(invitationDO);
    }

    @Override
    public Map<String, Object> findUserCollectList(Long userId) {
        ParamCheckUtils.checkParam(userId);
        getUserByUserIdAndCheckUser(userId);
        Map<String,Object> result = new HashMap<>();
        //查出用户收藏的报告
        List<ReportDO> reportList = userDao.findCollectReportListByUserId(userId, ConstantEnum.REPORTCONTENTTYPE.getValue());
        List<ReportDO> sortedReportList = reportList.stream().sorted(new Comparator<ReportDO>() {
            @Override
            public int compare(ReportDO o1, ReportDO o2) {
                return (int)(o2.getCollectTime() - o1.getCollectTime());
            }
        }).collect(toList());
        List<ReportVO> reportVOList = reportDOListTrunReportVOList(userId,sortedReportList);
        //查出用户收藏的视频
        List<VideoVO> videoVOList = getCollectVideoByUserId(userId);
        result.put(ConstantEnum.REPORTLIST.getValue(), reportVOList);
        result.put(ConstantEnum.VIDEOLIST.getValue(), videoVOList);
        return result;
    }

    @Override
    public Map<String, Object> findUserDownloadList(Long userId) {
        ParamCheckUtils.checkUserId(userId);
        Map<String,Object> result = new HashMap<>();
        List<ReportDO> reportList = userDao.findDownloadReportListByUserId(userId);
        List<ReportDO> sortedReportList = reportList.stream().sorted(new Comparator<ReportDO>() {
            @Override
            public int compare(ReportDO o1, ReportDO o2) {
                return (int)(o2.getDownloadTime() - o1.getDownloadTime());
            }
        }).distinct().collect(toList());
        List<ReportVO> reportVOList = reportDOListTrunReportVOList(userId,sortedReportList);
        result.put(ConstantEnum.REPORTLIST.getValue(), reportVOList);
        return result;
    }

    @Override
    public void updateUserbyid(CommonParam param) {
        ParamCheckUtils.checkParam(param.getUserId());
        UserDO user = userDao.findUserByUserId(param.getUserId());
        //用来判断传入参数都为null的情况
        Boolean paramIsNull = true;
        if(param.getUsername() != null && !StringUtils.isEmpty(param.getUsername())){
            paramIsNull = false;
            if(user.getUserName() == null){
                addScoreByUserId(user.getUserId(),SUPPLEMENTUSERNAME);
            }
            user.setUserName(param.getUsername());
        }
        if(param.getCompany() != null && !StringUtils.isEmpty(param.getCompany())){
            paramIsNull = false;
            if(user.getCompany() == null){
                addScoreByUserId(user.getUserId(),SUPPLEMENTCOMPANY);
            }
            user.setCompany(param.getCompany());
        }
        if(param.getPosition() != null && !StringUtils.isEmpty(param.getPosition())){
            paramIsNull = false;
            if(user.getPosition() == null){
                addScoreByUserId(user.getUserId(),SUPPLEMENTPOSITION);
            }
            user.setPosition(param.getPosition());
        }
        if(param.getPhoneNumber() != null && !StringUtils.isEmpty(param.getPhoneNumber())){
            paramIsNull = false;
            if(user.getPhoneNumber() == null){
                addScoreByUserId(user.getUserId(),SUPPLEMENTPHONE);
            }
            user.setPhoneNumber(param.getPhoneNumber());
        }
        if(param.getEmail() != null && !StringUtils.isEmpty(param.getEmail())){
            paramIsNull = false;
            if(user.getEmail() == null){
                addScoreByUserId(user.getUserId(),SUPPLEMENTEMAIL);
            }
            user.setEmail(param.getEmail());
        }
        if(paramIsNull){
            log.info("用户信息为：" + user.toString());
            log.info("更新信息为：" + param.toString());
            throw new BasicException(ExceptionEnum.PARAM_EXCEPTION.customMessage("参数错误！"));
        }
        int status = userDao.updateUserByUserId(user);
        if(status <= 0){
            log.info("用户信息为：" + user.toString());
            log.info("更新信息为：" + param.toString());
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("更新用户信息失败！"));
        }

    }

    @Override
    public void addScoreByUserId(Long userId ,ScoreDetailTypeEnum scoreDetailTypeEnum) {
        ScoreDO scoreDO = new ScoreDO();
        scoreDO.setUserId(userId);
        scoreDO.setScoreType(scoreDetailTypeEnum.getScoreType());
        scoreDO.setScoreDesc(scoreDetailTypeEnum.getScoreDesc());
        scoreDO.setScore(scoreDetailTypeEnum.getScore());
        scoreDO.setScoreTime(CigDateUtil.currentTimeStamp());
        int status = userDao.addScoreRecord(scoreDO);
        if(status <= 0){
            log.error("userId为："+userId);
            log.error("添加的积分类型为："+scoreDO.toString());
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("给用户增加积分失败！"));
        }
        //添加完积分记录之后，还需要检查一下用户的等级是否可以升级
        Long userScore = findUserScore(userId);
        UserDO user = userDao.findUserByUserId(userId);
        if(userScore >= userLevelScore.get(user.getUserLevel())){
            int sta = userDao.updateUserLevelByUserId(userId, getUserlevelByScore(userScore));
            if(sta <= 0){
                log.error("用户添加积分后更新等级失败：" + user.toString());
                throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("给用户更新等级失败！"));
            }
        }
    }

    @Override
    public void otherAddScoreByUserId(CommonParam param) {
        ParamCheckUtils.checkUserId(param.getUserId());
        ParamCheckUtils.checkParam(param.getScoreType());
        ScoreDetailTypeEnum scoreDetailTypeEnumByScoreType = ScoreDetailTypeEnum.getScoreDetailTypeEnumByScoreType(param.getScoreType().intValue());
        if(SHAREWXAPPLICATION.equals(scoreDetailTypeEnumByScoreType)){
            UserFeed userFeed = getUserFeed(param.getUserId(), 0L,WXAPPLICATIONCONTENTTYPE.getValue(),SHAREFEEDTYPE.getValue());
            int status = userDao.addFeedRecord(userFeed);
            if(status <= 0){
                log.info("userId:[{}],分享小程序失败！",param.getUserId());
                throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("分享失败！"));
            }
            userFeed.setBeginTime(CigDateUtil.currentDayBeginTimeStamp());
            userFeed.setEndTime(CigDateUtil.currentDayEndTimeStamp());
            int shareCountAtCurrentDay = userDao.findCountUserFeedRecordAtTime(userFeed);
            if(shareCountAtCurrentDay <= 2){
                addScoreByUserId(param.getUserId(),scoreDetailTypeEnumByScoreType);
            }
        }else {
            addScoreByUserId(param.getUserId(),scoreDetailTypeEnumByScoreType);
        }


    }

    @Override
    public Map<String, Object> getUserScoreDetail(Long userId) {
        ParamCheckUtils.checkUserId(userId);
        Map<String, Object> res = new LinkedHashMap<>();
        List<ScoreDetailDO> scoreDetailByUserId = userDao.findScoreDetailByUserId(userId);
        List<ScoreDetailVO> scoreVODetailList = new ArrayList<>();
        for(ScoreDetailDO scoreDetailDO:scoreDetailByUserId){
            ScoreDetailVO scoreDetailVO = ScoreDetailVO.doTurnVO(scoreDetailDO);
            scoreVODetailList.add(scoreDetailVO);
        }
        res.put("userId",userId.toString());
        res.put("scoreList",scoreVODetailList);
        return res;
    }

    @Override
    public Map<String, Object> judgeTokenIsOk(String token) {
        ParamCheckUtils.checkParam(token);
        Map<String,Object> result = new LinkedHashMap<>();
        result.put("token",token);
        String openId = null;
        try {
            openId = jwtTokenUtils.getOpenIdFromToken(token);
        }catch (Exception e){
            result.put("isOk",Boolean.FALSE);
            return result;
        }
        if(openId != null){
            UserDO user = findUserByOpenId(openId);
            if(user == null){
                result.put("isOk",Boolean.FALSE);
                return result;
            }
        }
        result.put("isOk",Boolean.TRUE);
        return result;
    }

    private List<VideoVO> getCollectVideoByUserId(Long userId) {
        List<VideoDO> videoList = new ArrayList<>();
        videoList = userDao.findCollectVideoListByUserId(userId, ConstantEnum.VIDEOCONTENTTYPE.getValue());
        List<VideoDO> sortedVideoList = videoList.stream().sorted(new Comparator<VideoDO>() {
            @Override
            public int compare(VideoDO o1, VideoDO o2) {
                return (int)(o2.getCollectTime() - o1.getCollectTime());
            }
        }).collect(toList());
        List<VideoVO> videoVOList = new ArrayList<>();
        for(VideoDO videoDO:sortedVideoList){
            VideoVO videoVO = VideoVO.videoDOToVideoVO(videoDO,cdnPrefix);
            videoVO.setCollectTime(DateUtil.date(videoDO.getCollectTime()).toDateStr());
            //查出每个视频的观看量
            Long viewCount = userDao.findActivityCountByContentId(videoDO.getVideoId(), VIEWFEEDTYPE.getValue(), VIDEOCONTENTTYPE.getValue());
            //查出每个视频点赞数
            Long likeCount = userDao.findActivityCountByContentId(videoDO.getVideoId(), LIKEFEEDTYPE.getValue(), VIDEOCONTENTTYPE.getValue());
            videoVO.setViewCounts(viewCount);
            videoVO.setLikeCounts(likeCount);
            videoVOList.add(videoVO);
        }
        return videoVOList;
    }

    /**
     * @Description: 将从数据库里查出来的每一个ReportDO对象转为ReportVO对象
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/10/15
     */
    private List<ReportVO> reportDOListTrunReportVOList(Long userId,List<ReportDO> reportList) {
        List<ReportVO> reportVOList = new ArrayList<>();
        for(ReportDO reportDO:reportList){
            ReportVO reportVO = ReportVO.reportDOToReportVO(reportDO,cdnPrefix);
            if(reportDO.getCollectTime() != null){
                reportVO.setCollectTime(DateUtil.date(reportDO.getCollectTime()).toDateStr());
            }
            if(reportDO.getDownloadTime() != null){
                reportVO.setDownLoadTime(DateUtil.date(reportDO.getDownloadTime()).toDateStr());
            }
            //查询每个报告的阅读量
            Long viewCount = userDao.findActivityCountByContentId(reportDO.getId(), VIEWFEEDTYPE.getValue(), REPORTCONTENTTYPE.getValue());
            reportVO.setViewCounts(viewCount);
            reportVO.setLinkUrl(cdnPrefix + reportDO.getLinkUrl());
            reportVOList.add(reportVO);
        }
        return reportVOList;
    }
}