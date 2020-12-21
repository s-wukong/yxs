package cn.com.cig.cigrsbackend.controller;

import cn.com.cig.cigrsbackend.exception.BasicException;
import cn.com.cig.cigrsbackend.model.dobj.UserDO;
import cn.com.cig.cigrsbackend.security.WxAppletAuthenticationToken;
import cn.com.cig.cigrsbackend.utils.CigDateUtil;
import cn.hutool.core.date.DateUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.web.servlet.error.AbstractErrorController;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RequestMapping("/error")
@Slf4j
public class CustomErrorController extends AbstractErrorController {

    private ErrorAttributes errorAttributes;

    private boolean includeStackTrace;

    public CustomErrorController(ErrorAttributes errorAttributes, boolean includeStackTrace) {
        super(errorAttributes);
        this.errorAttributes = errorAttributes;
        this.includeStackTrace = includeStackTrace;
    }

    @RequestMapping
    @ResponseBody
    public ResponseEntity<Map<String, Object>> error(HttpServletRequest request, HttpServletResponse response){
        WebRequest webRequest = new ServletWebRequest(request);
        Map<String, Object> resultMap = new HashMap<>();
        Throwable error = errorAttributes.getError(webRequest);
        if( error instanceof BasicException) {
            BasicException exception = (BasicException) error;
            resultMap.put("status", exception.getStatus());
            resultMap.put("message", exception.getMessage());
        }else {
           resultMap = getErrorAttributes(request, includeStackTrace);
           log.error("[{}]发生了服务器内部错误：[{}]", DateUtil.date(CigDateUtil.currentTimeStamp()).toDateStr(),resultMap);
        }
        return new ResponseEntity(resultMap, HttpStatus.OK);
    }

    @Override
    public String getErrorPath() {
        return "/error";
    }


    @SuppressWarnings("unchecked")
    private <T> T getAttribute(RequestAttributes requestAttributes, String name) {
        return (T) requestAttributes.getAttribute(name, RequestAttributes.SCOPE_REQUEST);
    }
}

