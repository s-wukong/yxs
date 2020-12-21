package cn.com.cig.cigrsbackend.model.dobj;

import lombok.Data;
import lombok.ToString;

/**
* @Description: 评论实体类与app_user_comment对应
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/25
*/
@Data
@ToString
public class CommentDO {

     private Long id;
     private Long videoId;
     private String conmentContent;
     private Long fromUid;
     private String fromUname;
     private Long toUid;
     private String toUname;
     private Long commentTime;
}