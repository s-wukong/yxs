package cn.com.cig.cigrsbackend.model.dobj;

import lombok.Data;
import lombok.ToString;

/**
* @Description: app_user_invitation 对应的实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/24
*/
@Data
@ToString
public class InvitationDO {

    private Long id;
    private Long fromUserId;//邀请人
    private Long toUserId;//被邀请人
    private Long invitationDate;//邀请成功的时间
}