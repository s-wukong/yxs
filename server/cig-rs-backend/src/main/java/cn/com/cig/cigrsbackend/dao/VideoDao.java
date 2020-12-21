package cn.com.cig.cigrsbackend.dao;

import cn.com.cig.cigrsbackend.model.dobj.CollectDO;
import cn.com.cig.cigrsbackend.model.dobj.CommentDO;
import cn.com.cig.cigrsbackend.model.dobj.UserFeed;
import cn.com.cig.cigrsbackend.model.dobj.VideoDO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
* @Description: 视频模块的DAO层
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/24
*/
public interface VideoDao {




    /**
    * @Description: 查询所有视频
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/25
    */
    @Select("select * from app_video order by order_key desc")
    List<VideoDO> findAllVideo();

    /**
    * @Description: 根据videoId查找视频
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/25
    */
    @Select("select * from app_video where video_id = #{videoId}")
    VideoDO findVideoById(Long videoId);

    /**
    * @Description: 查询视频的所有评论
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/25
    */
    @Select("select * from app_user_comment where video_id = #{videoId}")
    List<CommentDO> findAllCommentByVideoId(long videoId);

    /**
    * @Description: 添加评论
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/25
    */
    @Insert("insert into app_user_comment(video_id,conment_content,from_uid,from_uname,comment_time) " +
            "values(#{videoId},#{conmentContent},#{fromUid},#{fromUname},#{commentTime})")
    int addComment(CommentDO commentDO);



}
