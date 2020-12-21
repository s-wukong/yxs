package cn.com.cig.cigrsbackend.model.vo;

import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.model.dobj.CommentDO;
import com.vdurmont.emoji.EmojiParser;
import lombok.Data;
import lombok.ToString;

/**
* @Description: 响应给前端展示的评论实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/25
*/
@ToString
@Data
public class CommentVO {

    private Long userId;
    private Long videoId;
    private String nickName;
    private String commentContent;

    /**
    * @Description: 数据库的实体类转换为面向接口的实体类
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/25
    */
    public static CommentVO doToVO(CommentDO commentDO){
        CommentVO commentVO = new CommentVO();
        commentVO.setUserId(commentDO.getId());
        commentVO.setNickName(commentDO.getFromUname());
        //针对emoji表情，对数据库里存储的评论内容进行解码
        commentVO.setCommentContent(commentDO.getConmentContent() == null? ConstantEnum.EMPTYSTRING.getValue() : EmojiParser.parseToUnicode(commentDO.getConmentContent()));
        return commentVO;
    }
}