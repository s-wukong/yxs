package cn.com.cig.cigrsbackend.aop;

import cn.com.cig.cigrsbackend.model.dobj.UserDO;
import cn.com.cig.cigrsbackend.model.dto.OperationLog;
import cn.com.cig.cigrsbackend.security.WxAppletAuthenticationToken;
import cn.com.cig.cigrsbackend.utils.CigDateUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.UUID;

/**
 * 添加切面对controller中的方法
 */
@Aspect
@Component
@Slf4j
public class ControllerLogAspect {

    /**
     * 以自定义 @ControllerLog 注解为切点
     */
    @Pointcut("@annotation(cn.com.cig.cigrsbackend.aop.ControllerLog)")
    public void controllerLog() {
    }

    /**
     * 在切点之前织入
     *
     * @param joinPoint
     * @throws Throwable
     */
    @Before("controllerLog()")
    public void doBefore(JoinPoint joinPoint) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDO userDO = ((WxAppletAuthenticationToken)authentication).getUser();
        OperationLog operationLog = new OperationLog();
        operationLog.setId(UUID.randomUUID().toString());
        operationLog.setNickName(userDO.getNickName());
        operationLog.setUserId(userDO.getUserId().toString());
        operationLog.setOperationMethod(joinPoint.getSignature().getName());
        operationLog.setParam(JSONUtil.toJsonStr(joinPoint.getArgs()).replace("-"," "));
        operationLog.setOperationDate(DateUtil.date(CigDateUtil.currentTimeStamp()).toDateStr());
        log.info(JSONUtil.toJsonStr(operationLog));
    }


    /**
     * 环绕
     *
     * @param proceedingJoinPoint
     * @return
     * @throws Throwable
     */
    @Around("controllerLog()")
    public Object doAround(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        Object result = proceedingJoinPoint.proceed();
        if(result == null){
            return null;
        }
        return result;
    }


}