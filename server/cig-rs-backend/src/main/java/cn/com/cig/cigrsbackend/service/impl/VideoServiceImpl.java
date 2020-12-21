package cn.com.cig.cigrsbackend.service.impl;

import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.dao.UserDao;
import cn.com.cig.cigrsbackend.dao.VideoDao;
import cn.com.cig.cigrsbackend.exception.BasicException;
import cn.com.cig.cigrsbackend.exception.ExceptionEnum;
import cn.com.cig.cigrsbackend.model.dobj.*;
import cn.com.cig.cigrsbackend.model.dto.CommentContentDTO;
import cn.com.cig.cigrsbackend.model.dto.WxAccessTokenDTO;
import cn.com.cig.cigrsbackend.model.vo.CommentVO;
import cn.com.cig.cigrsbackend.model.vo.VideoVO;
import cn.com.cig.cigrsbackend.service.UserService;
import cn.com.cig.cigrsbackend.service.VideoService;
import cn.com.cig.cigrsbackend.utils.ParamCheckUtils;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONUtil;
import com.vdurmont.emoji.EmojiParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static cn.com.cig.cigrsbackend.constants.ConstantEnum.*;
import static cn.com.cig.cigrsbackend.constants.ScoreDetailTypeEnum.*;
import static cn.com.cig.cigrsbackend.utils.CigDateUtil.currentDayBeginTimeStamp;
import static cn.com.cig.cigrsbackend.utils.CigDateUtil.currentDayEndTimeStamp;
import static cn.com.cig.cigrsbackend.utils.ParamCheckUtils.checkUserIdAndContentId;
import static cn.com.cig.cigrsbackend.utils.ParamCheckUtils.checkContentId;
import static cn.com.cig.cigrsbackend.utils.ReportAndVideoUitl.getUserFeed;
import static java.util.stream.Collectors.toList;

/**
 * @Description: 视频服务实现类
 * @Author: liushilei
 * @Version: 1.0
 * @Date: 2020/9/24
 */
@Slf4j
@Service
public class VideoServiceImpl implements VideoService {

    @Autowired
    UserDao userDao;

    @Autowired
    VideoDao videoDao;

    @Autowired
    UserService userService;

    @Value("${cdn.prefix}")
    private String cdnPrefix;

    @Value("${wx.appid}")
    private String appid;

    @Value("${wx.appsecret}")
    private String appsrcret;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public void videoShare(Long userId, Long videoId) {
        checkUserIdAndContentId(userId, videoId,VIDEOCONTENTTYPE.getValue());
        UserFeed userFeed = getUserFeed(userId, videoId,VIDEOCONTENTTYPE.getValue(),SHAREFEEDTYPE.getValue());
        int status = userDao.addFeedRecord(userFeed);
        if(status <= 0){
            log.info("userID:[{}],videoID:[{}]",userId,videoId);
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("分享失败！"));
        }
        userFeed.setBeginTime(currentDayBeginTimeStamp());
        userFeed.setEndTime(currentDayEndTimeStamp());
        //当前天分享次数
        int shareCountAtCurrentDay = userDao.findCountUserFeedRecordAtTime(userFeed);
        if(shareCountAtCurrentDay <= 2){
            userService.addScoreByUserId(userId,SHAREVIDEO);
        }
    }



    @Override
    public void videoLike(Long userId, Long videoId) {
        checkUserIdAndContentId(userId,videoId,VIDEOCONTENTTYPE.getValue());
        UserFeed userFeed = getUserFeed(userId, videoId,VIDEOCONTENTTYPE.getValue(),LIKEFEEDTYPE.getValue());
        int status = userDao.addFeedRecord(userFeed);
        if(status <= 0){
            log.info("userID:[{}],videoID:[{}]",userId,videoId);
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("点赞失败！"));
        }
        userFeed.setBeginTime(currentDayBeginTimeStamp());
        userFeed.setEndTime(currentDayEndTimeStamp());
        //当前天点赞次数
        int likeCountAtCurrentDay = userDao.findCountUserFeedRecordAtTime(userFeed);
        if(likeCountAtCurrentDay <= 3){
            userService.addScoreByUserId(userId,LIKE);
        }
    }

    @Override
    public void videoView(Long userId, Long videoId) {
        checkUserIdAndContentId(userId,videoId,VIDEOCONTENTTYPE.getValue());
        UserFeed userFeed = getUserFeed(userId, videoId,VIDEOCONTENTTYPE.getValue(),VIEWFEEDTYPE.getValue());
        int status = userDao.addFeedRecord(userFeed);
        if(status <= 0){
            log.info("userID:[{}],videoID:[{}]",userId,videoId);
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("添加观看记录失败！"));
        }
    }


    @Override
    public Map<String, List<VideoVO>> findAllVideo() {
        List<VideoVO> videoVOList = new ArrayList<>();
        Map<String,List<VideoVO>> result = new HashMap<>();
        List<VideoDO> allVideo = videoDao.findAllVideo();
        for(VideoDO videoDO:allVideo){
            VideoVO videoVO = generateVideoVO(videoDO);
            videoVOList.add(videoVO);
        }
        result.put(ConstantEnum.VIDEOLIST.getValue(), videoVOList);
        return result;
    }

    @Override
    public VideoVO findVideoByIdAndUserId(Long userId, Long videoId) {
        checkContentId(videoId,VIDEOCONTENTTYPE.getValue());
        int countByUserIdAndContent = userDao.findCollectCountByUserIdAndContent(userId, VIDEOCONTENTTYPE.getValue(), videoId);
        VideoDO videoDO = videoDao.findVideoById(videoId);
        VideoVO videoVO = generateVideoVO(videoDO);
        videoVO.setSynopsis(videoDO.getSynopsis());
        videoVO.setVideoLink(videoDO.getVideoLink());
        if(countByUserIdAndContent > 0){
            videoVO.setIsCollect(Boolean.TRUE);
        }else {
            videoVO.setIsCollect(Boolean.FALSE);
        }
        return videoVO;
    }

    @Override
    public Map<String, List<CommentVO>> findCommentByVideoId(Long videoId) {
        Map<String,List<CommentVO>> result = new HashMap<>();
        checkContentId(videoId,VIDEOCONTENTTYPE.getValue());
        List<CommentDO> commentDOList = new ArrayList<>();
        commentDOList =  videoDao.findAllCommentByVideoId(videoId);
        List<CommentDO> sortedCommentDOList = commentDOList.stream().sorted(new Comparator<CommentDO>() {
            @Override
            public int compare(CommentDO o1, CommentDO o2) {
                return (int)(o2.getCommentTime() - o1.getCommentTime());
            }
        }).collect(toList());
        List<CommentVO> commentVOList = new ArrayList<>();
        for(CommentDO commentDO:sortedCommentDOList){
            commentVOList.add(CommentVO.doToVO(commentDO));
        }
        result.put(COMMENTLIST.getValue(),commentVOList);
        return result;
    }

    @Override
    public CommentVO addComment(Long userId, Long videoId, String commentContent) {
        ParamCheckUtils.checkParam(userId);
        ParamCheckUtils.checkParam(commentContent);
        //检查评论内容是否含有敏感信息
        checkCommentContent(userId, commentContent);
        UserDO user = ParamCheckUtils.getUserByUserIdAndCheckUser(userId);
        checkContentId(videoId,VIDEOCONTENTTYPE.getValue());
        CommentDO commentDO = new CommentDO();
        commentDO.setFromUid(userId);
        commentDO.setFromUname(user.getNickName());
        commentDO.setVideoId(videoId);
        //针对emoji表情对评论内容进行转码
        commentDO.setConmentContent(EmojiParser.parseToHtmlDecimal(commentContent));
        commentDO.setCommentTime(System.currentTimeMillis());
        int status = videoDao.addComment(commentDO);
        if(status <= 0){
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("评论失败！"));
        }
        CommentVO commentVO = CommentVO.doToVO(commentDO);
        commentVO.setVideoId(videoId);
        return commentVO;
    }

    private void checkCommentContent(Long userId, String commentContent) {
        String wxTokenUrl = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s";
        String tokenUrl = String.format(wxTokenUrl, appid, appsrcret);
        WxAccessTokenDTO wxToken = restTemplate.getForObject(tokenUrl, WxAccessTokenDTO.class);
        log.info("与微信API交互的token:[{}]",wxToken.getAccess_token());
        String wxCheckContentUrl = "https://api.weixin.qq.com/wxa/msg_sec_check?access_token=%s";
        String checkContentUrl = String.format(wxCheckContentUrl, wxToken.getAccess_token());
        CommentContentDTO commentContentDTO = new CommentContentDTO();
        commentContentDTO.setContent(commentContent);
        String resResult= HttpUtil.post(checkContentUrl, JSONUtil.toJsonStr(commentContentDTO));
        log.info("检查:[{}]是否合规：[{}]",commentContent,resResult);
        if(0 != (JSONUtil.parseObj(resResult).getInt("errcode"))){
            log.info("[{}]评论[{}]含有敏感信息！",userId,commentContent);
            throw new BasicException(ExceptionEnum.PARAM_EXCEPTION.customMessage("您的评论涉及敏感信息，请重新输入"));
        }
    }

    @Override
    public void collectVideo(Long userId, Long videoId) {
        checkUserIdAndContentId(userId,videoId,VIDEOCONTENTTYPE.getValue());
        //判断用户是否已经收藏
        int count = userDao.findCollectCountByUserIdAndContent(userId, VIDEOCONTENTTYPE.getValue(), videoId);
        if(count > 0){
            return;
        }
        CollectDO collectDO = new CollectDO();
        collectDO.setUserId(userId);
        collectDO.setContentType(VIDEOCONTENTTYPE.getValue());
        collectDO.setContentId(videoId);
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
    public void cancelCollectVideo(Long userId, Long videoId) {
        checkUserIdAndContentId(userId,videoId,VIDEOCONTENTTYPE.getValue());
        //判断用户是否已经取消收藏
        int count = userDao.findCollectCountByUserIdAndContent(userId, VIDEOCONTENTTYPE.getValue(), videoId);
        if(count == 0){
            return;
        }
        CollectDO collectDO = new CollectDO();
        collectDO.setUserId(userId);
        collectDO.setContentType(VIDEOCONTENTTYPE.getValue());
        collectDO.setContentId(videoId);
        int status = userDao.deleteCollectRecord(collectDO);
        if(status <= 0){
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("取消收藏失败！"));
        }
    }


    /**
     * @Description: 通过VideoDO生成VideoVOA对象
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/25
     */
    private VideoVO generateVideoVO(VideoDO videoDO) {
        //将这两个对象共有的属性进行复制
        VideoVO videoVO = VideoVO.videoDOToVideoVO(videoDO,cdnPrefix);
        //查出每个视频的观看量
        Long viewCount = userDao.findActivityCountByContentId(videoDO.getVideoId(), VIEWFEEDTYPE.getValue(), VIDEOCONTENTTYPE.getValue());
        //查出每个视频点赞数
        Long likeCount = userDao.findActivityCountByContentId(videoDO.getVideoId(), LIKEFEEDTYPE.getValue(), VIDEOCONTENTTYPE.getValue());
        videoVO.setViewCounts(viewCount);
        videoVO.setLikeCounts(likeCount);
        return videoVO;
    }


}