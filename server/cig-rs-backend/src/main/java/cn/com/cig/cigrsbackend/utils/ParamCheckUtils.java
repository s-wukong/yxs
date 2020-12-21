package cn.com.cig.cigrsbackend.utils;

import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.dao.ReportDao;
import cn.com.cig.cigrsbackend.dao.UserDao;
import cn.com.cig.cigrsbackend.dao.VideoDao;
import cn.com.cig.cigrsbackend.exception.BasicException;
import cn.com.cig.cigrsbackend.exception.ExceptionEnum;
import cn.com.cig.cigrsbackend.model.dobj.ReportDO;
import cn.com.cig.cigrsbackend.model.dobj.UserDO;
import cn.com.cig.cigrsbackend.model.dobj.VideoDO;
import cn.hutool.extra.spring.SpringUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
@Slf4j
public class ParamCheckUtils {

    private ParamCheckUtils(){

    }

    /**
    * @Description: 对传进来的参数进行null和空串检验
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/27
    */
    public static void checkParam(Long param) {
        if (param == null) {
            log.info("传入的参数为null");
            throw new BasicException(ExceptionEnum.PARAM_EXCEPTION.customMessage("参数错误！"));
        }
        if (param <= 0){
            log.info("传入的参数为 <= 0,参数为：" + param);
            throw new BasicException(ExceptionEnum.PARAM_EXCEPTION.customMessage("参数错误！"));
        }
    }

    public static void checkParam(Boolean param) {
        if (param == null) {
            log.info("传入的参数为null");
            throw new BasicException(ExceptionEnum.PARAM_EXCEPTION.customMessage("参数错误！"));
        }
    }

    public static void checkParam(String param) {
        if (param == null) {
            log.info("传入的参数为null");
            throw new BasicException(ExceptionEnum.PARAM_EXCEPTION.customMessage("参数错误！"));
        }
        if (StringUtils.isBlank(param)){
            log.info("传入的参数为空字符串");
            throw new BasicException(ExceptionEnum.PARAM_EXCEPTION.customMessage("参数错误！"));
        }
    }

    public static void checkUserIdAndContentId(Long userId, Long contentId,String contentType) {
        checkUserId(userId);
        checkContentId(contentId,contentType);
    }

    public static void checkContentId(Long contentId,String contentType) {
        ParamCheckUtils.checkParam(contentId);
        if(ConstantEnum.VIDEOCONTENTTYPE.getValue().equals(contentType)){
            getVideoByVideoIdAndCheckVideo(contentId);
        }else {
            getReportByReportIdAndCheckReport(contentId);
        }
    }

    public static void checkUserId(Long userId) {
        ParamCheckUtils.checkParam(userId);
        ParamCheckUtils.getUserByUserIdAndCheckUser(userId);
    }

    /**
     * @Description: 根据userID获取user对象，如果user对象为null抛出异常
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/27
     */
    public static UserDO getUserByUserIdAndCheckUser(Long userId) {
        UserDao userDao = SpringUtil.getBean(UserDao.class);
        UserDO userDO = userDao.findUserByUserId(userId);
        if(userDO == null){
            log.info("传入的用户Id为：" + userId);
            throw new BasicException(ExceptionEnum.PARAM_EXCEPTION.customMessage("该用户不存在！"));
        }
        return userDO;
    }

    /**
     * @Description: 根据videoId获取video对象，并校验视频对象是否存在
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/27
     */
    public static VideoDO getVideoByVideoIdAndCheckVideo(Long videoId) {
        VideoDao videoDao = SpringUtil.getBean(VideoDao.class);
        VideoDO videoDO = videoDao.findVideoById(videoId);
        if(videoDO == null){
            log.info("查询不到该视频ID："+videoId);
            throw new BasicException(ExceptionEnum.PARAM_EXCEPTION.customMessage("该视频不存在！"));
        }
        return videoDO;
    }

    /**
     * @Description: 根据reportId获取Report对象，并校验报告对象是否存在
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/27
     */
    public static ReportDO getReportByReportIdAndCheckReport(Long reportId) {
        ReportDao reportDao = SpringUtil.getBean(ReportDao.class);
        ReportDO report = reportDao.findReportByReportId(reportId);
        if(report == null){
            log.info("查询不到该报告ID："+reportId);
            throw new BasicException(ExceptionEnum.PARAM_EXCEPTION.customMessage("该报告不存在！"));
        }
        return report;
    }
}