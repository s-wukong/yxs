package cn.com.cig.cigrsbackend.dao;


import cn.com.cig.cigrsbackend.CigRsBackendApplication;
import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.constants.ScoreDetailTypeEnum;
import cn.com.cig.cigrsbackend.model.dobj.*;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.w3c.dom.ls.LSOutput;

import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CigRsBackendApplication.class)
@EnableAutoConfiguration
@Slf4j
public class UserDaoTest {

    //为了下面测试所用，写在这里主要是为了统一修改方便
    private Long userId = 8L;
    private Long reportId = 1L;

    @Autowired
    UserDao userDao;

    @Test
    public void findAllTest(){
        List<UserDO> allUser = userDao.findAllUser();
        Assert.assertNotNull(allUser);
        log.info(allUser.toString());
    }

    @Test
    public void addUserTest(){
        int status = userDao.addUser(getUser());
        Assert.assertTrue(status > 0);
    }

    @Test
    public void findUserByUserId(){
        UserDO user = userDao.findUserByUserId(userId);
        Assert.assertNotNull(user);
    }


    @Test
    public void updateUserLastLoginTimeTest(){
        int status = userDao.updateUserLastLoginTime(userId,234222222L);
       Assert.assertTrue(status > 0);
    }

    @Test
    public void updateUser(){
        UserDO user = userDao.findUserByUserId(userId);
        user.setNickName("笑哈哈");
        int status = userDao.updateUserByUserId(user);
        Assert.assertTrue(status > 0);
    }

    @Test
    public void findScoreByUserIdTest(){
        Long score = userDao.findScoreByUserId(userId);
        Assert.assertTrue(score > 0);
    }

    @Test
    public void findLastScoreActivityTimeByUserIdTest(){
        Long scoreActivityLastTime = userDao.findLastScoreActivityTimeByUserId(userId, ScoreDetailTypeEnum.SINGIN.getScoreType());
        Assert.assertTrue(scoreActivityLastTime > 0);
    }

    @Test
    public void addUserSignInTest(){
        ScoreDO scoreDO = new ScoreDO();
        scoreDO.setUserId(userId);
        scoreDO.setScore(20L);
        scoreDO.setScoreType(1);
        scoreDO.setScoreType(ScoreDetailTypeEnum.SINGIN.getScoreType());
        scoreDO.setScoreTime(System.currentTimeMillis());
        userDao.addUserSignIn(scoreDO);
    }

    @Test
    public void addInvitationRecordTest(){
        InvitationDO invitationDO = new InvitationDO();
        invitationDO.setFromUserId(userId);
        invitationDO.setToUserId(9L);
        invitationDO.setInvitationDate(System.currentTimeMillis());
        int status = userDao.addInvitationRecord(invitationDO);
        Assert.assertTrue(status > 0);
    }

    @Test
    public void findCollectVideoListByUserIdTest(){
        List<VideoDO> collectVideoListByUserId = userDao.findCollectVideoListByUserId(userId, ConstantEnum.VIDEOCONTENTTYPE.getValue());
        Assert.assertNotNull(collectVideoListByUserId);
    }

    @Test
    public void findCollectReportListByUserIdTest(){
        List<ReportDO> collectReportListByUserId = userDao.findCollectReportListByUserId(userId, ConstantEnum.REPORTCONTENTTYPE.getValue());
        Assert.assertNotNull(collectReportListByUserId);
    }
    @Test
    public void addDownloadRecordTest(){
        DownloadDO downloadDO = new DownloadDO();
        downloadDO.setUserId(userId);
        downloadDO.setReportId(reportId);
        downloadDO.setDownloadUrl("https://xxxx");
        downloadDO.setDownloadTime(1602432001003L);
        int status = userDao.addDownloadRecord(downloadDO);
        Assert.assertTrue(status > 0);
    }

    @Test
    public void findDownloadRecordByUserIdTest(){
        List<DownloadDO> downloadRecordByUserId = userDao.findDownloadRecordByUserId(userId);
        Assert.assertTrue(downloadRecordByUserId.size() > 0);
    }

    @Test
    public void findDownloadRecordByUserIdAndReprotIdTest(){
        List<DownloadDO> result = userDao.findDownloadRecordByUserIdAndReprotId(userId, reportId, 1602432001000L);
        Assert.assertTrue(result.size() > 1);
    }

    @Test
    public void findDownloadRecordByUserIdTest2(){
        List<DownloadDO> downloadRecordByUserId = userDao.findDownloadRecordByUserIdAndTime(userId, 1602518401000L);
        Assert.assertTrue(downloadRecordByUserId.size() > 1);
    }

    @Test
    public void findCountUserFeedRecordAtTimeTest(){
        UserFeed userFeed = new UserFeed();
        userFeed.setUserId(17L);
        userFeed.setContentId(3L);
        userFeed.setContentType(1);
        userFeed.setFeedType(20);
        long beginTime = 1602641893095L;
        long endTime = 1602642694773L;
        userFeed.setBeginTime(beginTime);
        userFeed.setEndTime(endTime);
        int countUserFeedRecordAtTime = userDao.findCountUserFeedRecordAtTime(userFeed);
        int distinctCountUserFeedRecordAtTime = userDao.findDistinctCountUserFeedRecordAtTime(userFeed);
        System.out.println(countUserFeedRecordAtTime);
        System.out.println(distinctCountUserFeedRecordAtTime);
        Assert.assertTrue(countUserFeedRecordAtTime > 0);
    }
    @Test
    public void findDownloadReportListByUserIdTest(){
        List<ReportDO> downloadReportListByUserId = userDao.findDownloadReportListByUserId(88L);
        Assert.assertTrue(downloadReportListByUserId.size() > 0);
    }

    @Test
    public void updateUserWxInfoTest(){
        UserDO userDO = new UserDO();
        userDO.setOpenId("ov6v_4_0wYhZgcCgyq9xEDFhyMtQ");
        userDO.setNickName("fun,fun");
        userDO.setAvatarUrl("https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIgGStEIXyF7hM2QTn0br2SjjJt7VTm838lqpuzyowGRicP95fQwvUfz8H5hoGIBhOgHgCE2UMqKvg/132");
        int status = userDao.updateUserWxInfo(userDO);
        Assert.assertTrue(status > 0);
    }


    private UserDO getUser(){
        UserDO user = new UserDO();
        user.setOpenId("fff");
        user.setUnionId("ggg");
        user.setUserName("王笑");
        user.setAvatarUrl("https://");
        user.setNickName("小A");
        user.setEmail("342@163.com");
        user.setRegistrationTime(System.currentTimeMillis());
        user.setLastLoginTime(System.currentTimeMillis());
        return user;
    }





}