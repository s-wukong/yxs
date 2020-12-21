package cn.com.cig.cigrsbackend.model.vo;

import cn.com.cig.cigrsbackend.model.dobj.InvitationDO;
import lombok.Data;
import lombok.ToString;

/**
* @Description: 邀请成功响应前台 对应的实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/24
*/
@Data
@ToString
public class InvitationVO {

    private Long fromUserId;//邀请人
    private Long toUserId;//被邀请人

    public static InvitationVO dOToVO(InvitationDO invitationDO){
        InvitationVO invitationVO = new InvitationVO();
        invitationVO.setFromUserId(invitationDO.getFromUserId());
        invitationVO.setToUserId(invitationDO.getToUserId());
        return invitationVO;
    }
}