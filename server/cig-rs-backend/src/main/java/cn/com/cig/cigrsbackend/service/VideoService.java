package cn.com.cig.cigrsbackend.service;

import cn.com.cig.cigrsbackend.model.dobj.UserDO;
import cn.com.cig.cigrsbackend.model.vo.*;

import java.util.List;
import java.util.Map;

/**
* @Description: video 服务接口
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/21
*/
public interface VideoService {


    /**
    * @Description: 视频分享
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/21
    */
    void videoShare(Long userId,Long videoId);

    /**
     * @Description: 视频点赞
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/21
     */
    void videoLike(Long userId,Long videoId);

    /**
     * @Description: 视频观看
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/21
     */
    void videoView(Long userId,Long videoId);

    /**
    * @Description: 视频列表
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/25
    */
    Map<String,List<VideoVO>> findAllVideo();

    /**
    * @Description: 根据用户ID和视频ID查视频以及用户关于这个视频的状态
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/25
    */
    VideoVO findVideoByIdAndUserId(Long userId,Long videoId);


    /**
    * @Description: 根据videoID查询视频的所有评论
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/25
    */
    Map<String,List<CommentVO>> findCommentByVideoId(Long videoId);

    /**
    * @Description: 添加评论记录
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/25
    */
    CommentVO addComment(Long userId,Long videoId,String commentContent);

    /**
    * @Description: 收藏视频
    * @Param: 
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/28
    */
    void collectVideo(Long userId,Long videoId);

    /**
    * @Description: 取消收藏
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/28
    */
    void cancelCollectVideo(Long userId,Long videoId);

    

}