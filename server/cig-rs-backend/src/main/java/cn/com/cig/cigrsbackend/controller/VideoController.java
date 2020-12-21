package cn.com.cig.cigrsbackend.controller;

import cn.com.cig.cigrsbackend.aop.ControllerLog;
import cn.com.cig.cigrsbackend.model.vo.CommentVO;
import cn.com.cig.cigrsbackend.model.vo.CommonParam;
import cn.com.cig.cigrsbackend.model.vo.RestResult;
import cn.com.cig.cigrsbackend.model.vo.VideoVO;
import cn.com.cig.cigrsbackend.service.VideoService;
import cn.com.cig.cigrsbackend.utils.RestResultGenerator;
import cn.hutool.core.bean.BeanUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/video")
public class VideoController {

    @Autowired
    VideoService videoService;


    //视频分享
    @RequestMapping(value = "/share", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String,Object>> videoShare(@RequestBody CommonParam param){
        videoService.videoShare(param.getUserId(),param.getVideoId());
        Map<String, Object> result = BeanUtil.beanToMap(param, false, true);
        return RestResultGenerator.getRestSuccessResult(result);
    }

    //查询所有视频
    @RequestMapping(value = "/findall", method = RequestMethod.POST)
    @ControllerLog
    public RestResult<Map<String, List<VideoVO>>> videoFindAll(@RequestBody CommonParam param){
        Map<String, List<VideoVO>> allVideo = videoService.findAllVideo();
        return RestResultGenerator.getRestSuccessResult(allVideo);
    }

    //视频详情
    @RequestMapping(value = "/findbyid", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<VideoVO> videoDetail(@RequestBody CommonParam param){
        VideoVO video = videoService.findVideoByIdAndUserId(param.getUserId(), param.getVideoId());
        return RestResultGenerator.getRestSuccessResult(video);
    }

    //视频评论
    @RequestMapping(value = "/findcommentsbyid", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String, List<CommentVO>>> findCommentListByVideoId(@RequestBody CommonParam param){
        Map<String, List<CommentVO>> commentByVideoId = videoService.findCommentByVideoId(param.getVideoId());
        return RestResultGenerator.getRestSuccessResult(commentByVideoId);
    }

    //发送评论
    @RequestMapping(value = "/addcomment", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<CommentVO> sendComment(@RequestBody CommonParam param){
        CommentVO commentVO = videoService.addComment(param.getUserId(), param.getVideoId(), param.getCommentContent());
        return RestResultGenerator.getRestSuccessResult(commentVO);
    }

    //视频点赞
    @RequestMapping(value = "/like", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String,Object>> videoLike(@RequestBody CommonParam param){
        videoService.videoLike(param.getUserId(),param.getVideoId());
        Map<String, Object> result = BeanUtil.beanToMap(param, false, true);
        return RestResultGenerator.getRestSuccessResult(result);
    }

    //视频观看
    @RequestMapping(value = "/view", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String,Object>> videoView(@RequestBody CommonParam param){
        videoService.videoView(param.getUserId(),param.getVideoId());
        Map<String, Object> result = BeanUtil.beanToMap(param, false, true);
        return RestResultGenerator.getRestSuccessResult(result);
    }

    //视频收藏、取消收藏
    @RequestMapping(value = "/collect", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String,Object>> videoCollect(@RequestBody CommonParam param){
        if(param.getIsCollect()){
            videoService.collectVideo(param.getUserId(),param.getVideoId());
        }else {
            videoService.cancelCollectVideo(param.getUserId(),param.getVideoId());
        }
        Map<String, Object> result = BeanUtil.beanToMap(param, false, true);
        return RestResultGenerator.getRestSuccessResult(result);
    }

}