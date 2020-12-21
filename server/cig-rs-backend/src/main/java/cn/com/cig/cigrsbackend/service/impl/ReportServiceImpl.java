package cn.com.cig.cigrsbackend.service.impl;


import cn.com.cig.cigrsbackend.common.CommonConstant;
import cn.com.cig.cigrsbackend.dao.ReportDao;
import cn.com.cig.cigrsbackend.dao.TranslationDao;
import cn.com.cig.cigrsbackend.dao.UserDao;
import cn.com.cig.cigrsbackend.exception.BasicException;
import cn.com.cig.cigrsbackend.exception.ExceptionEnum;
import cn.com.cig.cigrsbackend.exception.ParamException;
import cn.com.cig.cigrsbackend.model.dobj.*;
import cn.com.cig.cigrsbackend.model.entity.TranslationEntity;
import cn.com.cig.cigrsbackend.model.vo.DownloadVO;
import cn.com.cig.cigrsbackend.model.vo.PublicityVO;
import cn.com.cig.cigrsbackend.model.vo.ReportVO;
import cn.com.cig.cigrsbackend.model.vo.TranlationVo;
import cn.com.cig.cigrsbackend.service.AwsS3Service;
import cn.com.cig.cigrsbackend.service.ReportService;
import cn.com.cig.cigrsbackend.service.UserService;
import cn.com.cig.cigrsbackend.utils.CigDateUtil;
import cn.com.cig.cigrsbackend.utils.ParamCheckUtils;
import cn.com.cig.cigrsbackend.utils.convertion.EntityVoUtil;
import cn.com.cig.cigrsbackend.utils.encrypt.NumberEncodeUtil;
import cn.com.cig.cigrsbackend.utils.encrypt.ScaleConvertUtil;
import cn.com.cig.cigrsbackend.utils.encrypt.ShortMD5;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static cn.com.cig.cigrsbackend.constants.ConstantEnum.*;
import static cn.com.cig.cigrsbackend.constants.ScoreDetailTypeEnum.*;
import static cn.com.cig.cigrsbackend.utils.CigDateUtil.currentDayBeginTimeStamp;
import static cn.com.cig.cigrsbackend.utils.CigDateUtil.currentDayEndTimeStamp;
import static cn.com.cig.cigrsbackend.utils.ParamCheckUtils.checkUserIdAndContentId;
import static cn.com.cig.cigrsbackend.utils.ReportAndVideoUitl.getUserFeed;
import static java.util.stream.Collectors.toList;

@Service
@Slf4j
public class ReportServiceImpl implements ReportService {

    @Autowired
    private ReportDao reportDao;

    @Autowired
    private UserDao userDao;
    @Autowired
    private TranslationDao translationDao;
    @Value("${short.prefix}")
    private String shortUrlSrc;
    @Autowired
    private AwsS3Service awsS3Service;

    @Autowired
    private UserService userService;


    @Value("${s3.env}")
    private String s3Env;

    @Value("${cdn.prefix}")
    private String cdnPrefix;

    @Value("${download.expiration}")
    private Long downloadExpiration;


    @Override
    public PublicityVO findUsePublicity() {
        PublicityDO publicityDO = reportDao.findUsePublicity();
        if(publicityDO == null){
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("数据库宣传无数据！"));
        }
        return PublicityVO.dOToVO(publicityDO);
    }

    @Override
    public List<ReportVO> findHotReport() {
        List<ReportVO> reportVOList = new ArrayList<>();
        List<ReportDO> hotReport = reportDao.findHotReport();
        for(ReportDO reportDO :hotReport){
            ReportVO reportVO = ReportVO.reportDOToReportVO(reportDO,cdnPrefix);
            reportVO.setBannerUrl(null);
            reportVO.setSecondTag(null);
            reportVO.setLinkUrl(cdnPrefix + reportDO.getLinkUrl());
            reportVOList.add(reportVO);
        }
        return reportVOList;
    }

    @Override
    public List<ReportVO> searchReportBywords(String searchWords) {
        List<ReportVO> reportVOList = new ArrayList<>();
        String[] splits = searchWords.split(SEARCHWORDSEPARATOR.getValue());
        List<List<ReportDO>> allSearchResult = new ArrayList<>();
        for(String word:splits){
            List<ReportDO> searchResult = reportDao.findReportListBySearchWord(word);
            allSearchResult.add(searchResult);
        }
        //所有关键词搜索的交集
        List<ReportDO> reportListBySearchWord = allSearchResult.stream().reduce((list1,list2) ->{list1.retainAll(list2);
            return list1;}).orElse(Collections.emptyList());
        for(ReportDO reportDO :reportListBySearchWord){
            ReportVO reportVO = ReportVO.reportDOToReportVO(reportDO,cdnPrefix);
            reportVO.setLinkUrl(cdnPrefix + reportDO.getLinkUrl());
            //查询每个报告的阅读量
            Long viewCount = userDao.findActivityCountByContentId(reportDO.getId(), VIEWFEEDTYPE.getValue(), REPORTCONTENTTYPE.getValue());
            reportVO.setViewCounts(viewCount);
            reportVOList.add(reportVO);
        }
        return reportVOList;
    }

    @Override
    public ReportVO findReportById(Long userId,Long reportId) {
        checkUserIdAndContentId(userId,reportId,REPORTCONTENTTYPE.getValue());
        ReportDO reportDO = reportDao.findReportByReportId(reportId);
        int countByUserIdAndContent = userDao.findCollectCountByUserIdAndContent(userId, REPORTCONTENTTYPE.getValue(), reportId);
        int downloadRecordCount = userDao.findDownloadRecordCount(userId, reportId);
        ReportVO reportVO = ReportVO.reportDOToReportVO(reportDO,cdnPrefix);
        reportVO.setUploadDate(null);
        reportVO.setSecondTag(null);
        reportVO.setBannerUrl(null);
        reportVO.setScore(reportDO.getScore());
        reportVO.setLinkUrl(cdnPrefix + reportDO.getLinkUrl());
        reportVO.setIsCollect(countByUserIdAndContent > 0);
        reportVO.setReportLevel(reportDO.getReportLevel());
        reportVO.setIsDownload(downloadRecordCount > 0);

        return reportVO;
    }

    @Override
    public void collectReport(Long userId, Long reportId) {
        checkUserIdAndContentId(userId,reportId,REPORTCONTENTTYPE.getValue());
        //判断用户是否已经收藏
        int count = userDao.findCollectCountByUserIdAndContent(userId, REPORTCONTENTTYPE.getValue(), reportId);
        if(count > 0){
            return;
        }
        CollectDO collectDO = new CollectDO();
        collectDO.setUserId(userId);
        collectDO.setContentType(REPORTCONTENTTYPE.getValue());
        collectDO.setContentId(reportId);
        collectDO.setCollectTime(System.currentTimeMillis());
        int status = userDao.addCollectRecord(collectDO);
        if(status <= 0){
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("收藏失败！"));
        }
        //当前天收藏次数
        int collectCountAtCurrentDay = userDao.findCollectCountAtTime(userId,currentDayBeginTimeStamp(),currentDayEndTimeStamp());
        if(collectCountAtCurrentDay <= 3){
            userService.addScoreByUserId(userId,COLLECT);
        }
    }

    @Override
    public void cancelCollectReport(Long userId, Long reportId) {
        checkUserIdAndContentId(userId,reportId,REPORTCONTENTTYPE.getValue());
        //判断用户是否已经取消收藏
        int count = userDao.findCollectCountByUserIdAndContent(userId, REPORTCONTENTTYPE.getValue(), reportId);
        if(count == 0){
            return;
        }
        CollectDO collectDO = new CollectDO();
        collectDO.setUserId(userId);
        collectDO.setContentType(REPORTCONTENTTYPE.getValue());
        collectDO.setContentId(reportId);
        int status = userDao.deleteCollectRecord(collectDO);
        if(status <= 0){
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("取消收藏失败！"));
        }
        //当前天收藏次数
        int collectCountAtCurrentDay = userDao.findCollectCountAtTime(userId,currentDayBeginTimeStamp(),currentDayEndTimeStamp());
        if(collectCountAtCurrentDay <= 3){
            userService.addScoreByUserId(userId,COLLECT);
        }
    }

    @Override
    public void reportShare(Long userId, Long reportId) {
        checkUserIdAndContentId(userId, reportId,REPORTCONTENTTYPE.getValue());
        UserFeed userFeed = getUserFeed(userId, reportId,REPORTCONTENTTYPE.getValue(),SHAREFEEDTYPE.getValue());
        int status = userDao.addFeedRecord(userFeed);
        if(status <= 0){
            log.info("userId:[{}],reportId:[{}]",userId,reportId);
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("分享失败！"));
        }
        userFeed.setBeginTime(CigDateUtil.currentDayBeginTimeStamp());
        userFeed.setEndTime(CigDateUtil.currentDayEndTimeStamp());
        //当前天分享次数
        int shareCountAtCurrentDay = userDao.findCountUserFeedRecordAtTime(userFeed);
        if(shareCountAtCurrentDay <= 2){
            userService.addScoreByUserId(userId,SHAREREPORT);
        }
    }

    @Override
    public void reportView(Long userId, Long reportId) {
        checkUserIdAndContentId(userId, reportId,REPORTCONTENTTYPE.getValue());
        UserFeed userFeed = getUserFeed(userId, reportId,REPORTCONTENTTYPE.getValue(),VIEWFEEDTYPE.getValue());
        int status = userDao.addFeedRecord(userFeed);
        if(status <= 0){
            log.info("userId:[{}],reportId:[{}]",userId,reportId);
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("添加观看记录失败！"));
        }
    }

    @Override
    public DownloadVO reportDownload(Long userId, Long reportId, String platform) {
        ParamCheckUtils.checkParam(userId);
        UserDO user = ParamCheckUtils.getUserByUserIdAndCheckUser(userId);
        ParamCheckUtils.checkParam(reportId);
        ReportDO report = ParamCheckUtils.getReportByReportIdAndCheckReport(reportId);
        //判断平台是否为微信平台，其他平台小程序暂不可下载
        if(!platform.equals("weapp")){
            throw new ParamException(ExceptionEnum.PLATFORM_DENIED);
        }
        //判断是否等级达标
        if(user.getUserLevel() < report.getReportLevel()){
            throw new ParamException(ExceptionEnum.USER_LEVEL_DENIED);
        }
        //用户关于报告之前的下载记录
        List<DownloadDO> preDownloads = userDao.findDlRbyUidAndRidAndLessTime(userId, reportId, currentDayEndTimeStamp());
        //如果之前下载过，直接下载，不加积分
        if(!preDownloads.isEmpty()){
            return getDownloadVO(userId, reportId, report);
        }
        //判断lv1的用户是否达到周下载上限，重复下载不计数
        if(user.getUserLevel() == 1){
            List<DownloadDO> downRecordsAtCurrentWeek = userDao.findDownloadRecordByUserIdAndTime(userId, CigDateUtil.currentWeekBeginTimeStamp());
            DownloadDO downloadDO = new DownloadDO();
            downloadDO.setUserId(userId);
            downloadDO.setReportId(reportId);
            if(downRecordsAtCurrentWeek.stream().distinct().count() >= 2 && !downRecordsAtCurrentWeek.contains(downloadDO)){
                throw new BasicException(ExceptionEnum.DOWNLOAD_WEEK_CEILING);
            }
        }
        //大于lv1 的用户当天下载新报告不能超过10个
        if(user.getUserLevel() > 1){
            List<DownloadDO> userAllDownload = userDao.findDownloadRecordByUserId(userId);
            //过滤出用户除了当前天之外的所有报告
            List<DownloadDO> userBeforeAllDownload = userAllDownload.stream().filter(d -> d.getDownloadTime() < CigDateUtil.currentDayBeginTimeStamp()).collect(toList());
            //用户当前天下载的报告
            List<DownloadDO> userCurrentDayDownload = userDao.findDownloadRecordByUserIdAndTime(userId, CigDateUtil.currentDayBeginTimeStamp());
            //当前天该用户下载的新报告列表，这里新报告的意思是关于该报告以前没有下过
            List<DownloadDO> currentDayNewDownload = userCurrentDayDownload.stream().filter(d -> !userBeforeAllDownload.contains(d)).collect(toList());
            if(currentDayNewDownload != null && currentDayNewDownload.size() >= 10){
                throw new BasicException(ExceptionEnum.DOWNLOAD_DAY_CEILING);
            }
        }
        DownloadVO downloadVO = getDownloadVO(userId, reportId, report);
        userService.addScoreByUserId(userId,DOWNLOAD);
        return downloadVO;
    }

    private synchronized DownloadVO getDownloadVO(Long userId, Long reportId, ReportDO report) {
        List<DownloadDO> userAboutReportAtCurrentDayDownload = userDao.findUserAboutReportAtCurrentDayDownload(userId, reportId, CigDateUtil.currentDayBeginTimeStamp(), CigDateUtil.currentDayEndTimeStamp());
        //判断用户当天是否下载过该报告
        if(userAboutReportAtCurrentDayDownload != null && !userAboutReportAtCurrentDayDownload.isEmpty()){
            //下载过,返回当天生成的url
            DownloadDO downloadDO = userAboutReportAtCurrentDayDownload.get(0);
            return DownloadVO.doToVo(downloadDO);
        }else {
            //当天没有下载过
            DownloadDO downloadDO = new DownloadDO();
            downloadDO.setUserId(userId);
            downloadDO.setReportId(reportId);
            downloadDO.setDownloadTime(CigDateUtil.currentTimeStamp());
            String objectKey = report.getLinkUrl().replaceFirst("\\.pdf","_large.pdf");
            //传入报告的link和过期时间生成一个预签名的URL
            log.info("userId:"+userId+"reportId:"+reportId);
            log.info("DownloadTime:"+CigDateUtil.currentTimeStamp());
            String presignedURL = awsS3Service.generatePresignedURL(objectKey,reportId, downloadExpiration);

            presignedURL =getShortUrlByUrl(presignedURL).getShortUrl();
            downloadDO.setDownloadUrl(presignedURL);
            int status = userDao.addDownloadRecord(downloadDO);
            if(status <= 0){
                log.error("userId:[{}],reportId:[{}]添加下载记录错误",userId,reportId);
                throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("下载错误！"));
            }
            return DownloadVO.doToVo(downloadDO);
        }
    }
    @Override
    public TranlationVo getShortUrlByUrl(String url) {
        // 若不是URL格式，直接返回空
        if(!isHttpUrl(url)) {
            return null;
        }
        String str= ShortMD5.shortUrl(url);
        // 如果该实体不为空，直接返回对应的短url
        List<TranslationEntity> list = translationDao.findByShortMD5(str);
        TranslationEntity translationEntity=new TranslationEntity();
        log.info("list链表:"+list);
        //防止相同的md5短码对应链接
        if (!list.isEmpty()){
            int num =0;//记录条数
            for (int i = 0; i < list.size(); i++) {
                if (list.get(i).getUrl().equals(url)){//
                    translationEntity=list.get(i);
                    //如果有符合的短链接，则num++
                    num++;
                    break;
                }
            }
            //如果没有相匹配的，则进入创建模块
            if (num==0){
                log.info("没有对应的短链接");
                translationDao.saveTranslation(translationEntity);
                Long currentId= translationEntity.getId();
               // Long currentId = translationDao.saveTranslation(translationEntity).getId();
                log.info("currentId:"+currentId);
                getSaveTra(url, shortUrlSrc, str, translationEntity, currentId);
                log.info("长连接为:"+translationEntity.getUrl());
                log.info("短链接为:"+translationEntity.getShortUrl()+"md5短码为:"+translationEntity.getShortMD5());

            }
            return EntityVoUtil.convertEntityToVo(translationEntity);
        }
        // 否则，重新生成转换实体并存入数据库 todo 存入缓存
        // 获取当前id并生成短url尾缀

        translationDao.saveTranslation(translationEntity);
        Long currentId= translationEntity.getId();
        log.info("currentId:"+currentId);
        getSaveTra(url, shortUrlSrc, str, translationEntity, currentId);


        return EntityVoUtil.convertEntityToVo(translationEntity);
    }
    //拼接短链接存入数据库
    private void getSaveTra(String url, String shortUrlSrc, String str, TranslationEntity translationEntity, Long currentId) {
        String shortUrlSuffix = ScaleConvertUtil.convert(NumberEncodeUtil.encryptId(currentId), CommonConstant.LENGTH_OF_SHORT_URL);
        // 短链接拼接
        log.info("没有对应的短链接，重新创建");
        String shortUrl = shortUrlSrc + shortUrlSuffix;
        translationEntity.setUrl(url);
        translationEntity.setShortUrl(shortUrl);
        translationEntity.setShortMD5(str);
        translationDao.updateTranslation(translationEntity);
        log.info("长连接为:"+translationEntity.getUrl());
        log.info("短链接为:"+translationEntity.getShortUrl()+"md5短码为:"+translationEntity.getShortMD5());
    }


    @Override
    public TranlationVo getUrlByShortUrl(String shortUrl) {
        TranslationEntity translationEntity = translationDao.findByShortUrl(shortUrl);
        if(translationEntity != null) {
            return EntityVoUtil.convertEntityToVo(translationEntity);
        }
        return null;
    }

    /**
     * 判断一个字符串是否为URL格式
     * @param url
     * @return
     */
    private boolean isHttpUrl(String url) {
        boolean isUrl = false;
        if(url.startsWith("http://") || url.startsWith("https://")) {
            isUrl = true;
        }
        return isUrl;
    }

}