package cn.com.cig.cigrsbackend.controller;

import cn.com.cig.cigrsbackend.aop.ControllerLog;
import cn.com.cig.cigrsbackend.constants.ScoreDetailTypeEnum;
import cn.com.cig.cigrsbackend.constants.ScoreLevelConstant;
import cn.com.cig.cigrsbackend.model.vo.CommonParam;
import cn.com.cig.cigrsbackend.model.vo.InvitationVO;
import cn.com.cig.cigrsbackend.model.vo.RestResult;
import cn.com.cig.cigrsbackend.model.vo.UserVO;
import cn.com.cig.cigrsbackend.service.UserService;
import cn.com.cig.cigrsbackend.utils.ParamCheckUtils;
import cn.com.cig.cigrsbackend.utils.RestResultGenerator;
import cn.hutool.core.bean.BeanUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService userService;

    //查询用户
    @RequestMapping(value = "/finduserbyid", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String,Object>> findUserByUserId(@RequestBody CommonParam param){
        UserVO userVO = userService.findUserByUserId(param.getUserId());
        Map<String, Object> result = BeanUtil.beanToMap(userVO, false, true);
        return RestResultGenerator.getRestSuccessResult(result);
    }

    //用户签到
    @RequestMapping(value = "/signin", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String,Object>> userSignIn(@RequestBody CommonParam param){
        UserVO userVO = userService.signIn(param.getUserId());
        Map<String, Object> result = BeanUtil.beanToMap(userVO, false, true);
        return RestResultGenerator.getRestSuccessResult(result);
    }

    //邀请成功
    @RequestMapping(value = "/invitation/add", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String,Object>> invitationAdd(@RequestBody CommonParam param){
        InvitationVO invitationVO = userService.invitedUser(param.getFromUserId(), param.getToUserId());
        Map<String, Object> result = BeanUtil.beanToMap(invitationVO, false, true);
        return RestResultGenerator.getRestSuccessResult(result);
    }

    //用户收藏列表
    @RequestMapping(value = "/findcollectbyid", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String, Object>> findUserCollect(@RequestBody CommonParam param){
        return RestResultGenerator.getRestSuccessResult(userService.findUserCollectList(param.getUserId()));
    }

    //用户信息修改
    @RequestMapping(value = "/updatebyid", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<CommonParam> updateUserbyid(@RequestBody CommonParam param){
        userService.updateUserbyid(param);
        return RestResultGenerator.getRestSuccessResult(param);
    }

    //用户下载列表
    @RequestMapping(value = "/finddownloadbyid", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String, Object>> findDownloadById(@RequestBody CommonParam param){
        return RestResultGenerator.getRestSuccessResult(userService.findUserDownloadList(param.getUserId()));
    }

    //用户加经验
    @RequestMapping(value = "/score/add", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<CommonParam> scoreAdd(@RequestBody CommonParam param){
        userService.otherAddScoreByUserId(param);
        return RestResultGenerator.getRestSuccessResult(param);
    }

    //根据用户ID获取经验明细
    @RequestMapping(value = "/findscorebyid", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String, Object>> findScoreDetailByUserId(@RequestBody CommonParam param){
        return RestResultGenerator.getRestSuccessResult(userService.getUserScoreDetail(param.getUserId()));
    }

    //判断用户token是否有效
    @RequestMapping(value = "/token", method = RequestMethod.POST, consumes = "application/json")
    public RestResult<Map<String, Object>> judgeTokenIsOk(@RequestBody CommonParam param){
        return RestResultGenerator.getRestSuccessResult(userService.judgeTokenIsOk(param.getToken()));
    }
}