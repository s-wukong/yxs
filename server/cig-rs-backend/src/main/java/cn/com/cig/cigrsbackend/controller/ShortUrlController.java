package cn.com.cig.cigrsbackend.controller;

import cn.com.cig.cigrsbackend.common.CommonConstant;
import cn.com.cig.cigrsbackend.model.dto.LogDownload;
import cn.com.cig.cigrsbackend.model.vo.TranlationVo;
import cn.com.cig.cigrsbackend.service.ReportService;
import cn.com.cig.cigrsbackend.utils.UserAgentUtils;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

@Slf4j
@RestController
@RequestMapping("/ufd")
public class ShortUrlController {
    @Autowired
    ReportService reportService;
    @Value("${short.prefix}")
    String shortUrlSrc;
    @GetMapping("/{shortUrl}")
    public ModelAndView redirect(@PathVariable String shortUrl, ModelAndView mav){
        // 获取对应的长链接（若短链接不存在，则跳转到默认页面）
        TranlationVo tranlationVo = reportService.getUrlByShortUrl(shortUrlSrc + shortUrl);
        String url = (tranlationVo == null) ? CommonConstant.DEFAULT_URL : tranlationVo.getUrl();
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes()).getRequest();
        String userAgent = request.getHeader("User-Agent");
        LogDownload logDownload= new LogDownload();
        logDownload.setUserAgent(userAgent);
        logDownload.setUrl(url);
        logDownload.setShortUrl(shortUrlSrc+shortUrl);
        logDownload.setBrowserName(UserAgentUtils.browserName(userAgent));
        logDownload.setOsName(UserAgentUtils.osName(userAgent));
        logDownload.setGetIpAddress(UserAgentUtils.getIpAddress(request));
        //如果存在则返回长连接，如果不存在则返回error页面
        log.info(JSONUtil.toJsonStr(logDownload));
        // 跳转
        mav.setViewName("redirect:" + url);

        return mav;
    }
}
