package cn.com.cig.cigrsbackend.controller;

import cn.com.cig.cigrsbackend.aop.ControllerLog;
import cn.com.cig.cigrsbackend.common.CommonConstant;
import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.model.vo.*;
import cn.com.cig.cigrsbackend.service.ReportService;
import cn.com.cig.cigrsbackend.utils.ParamCheckUtils;
import cn.com.cig.cigrsbackend.utils.RestResultGenerator;
import cn.com.cig.cigrsbackend.utils.response.ResponseUtil;
import cn.com.cig.cigrsbackend.utils.response.ResponseVo;
import cn.hutool.core.bean.BeanUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/report")
public class ReportController {

    @Autowired
    ReportService reportService;

    //查询正在使用的报告宣传
    @RequestMapping(value = "/publicity", method = RequestMethod.POST)
    @ControllerLog
    public RestResult<PublicityVO> reportPublicity(){
        PublicityVO usePublicity = reportService.findUsePublicity();
        return RestResultGenerator.getRestSuccessResult(usePublicity);
    }

    //报告热推
    @RequestMapping(value = "/recommended", method = RequestMethod.POST)
    @ControllerLog
    public RestResult<Map<String,List<ReportVO>>> reportRecommended(){
        Map<String,List<ReportVO>> result = new HashMap<>();
        List<ReportVO> hotReport = reportService.findHotReport();
        result.put(ConstantEnum.REPORTLIST.getValue(),hotReport);
        return RestResultGenerator.getRestSuccessResult(result);
    }

    //报告搜索
    @RequestMapping(value = "/search", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String,List<ReportVO>>> reportSearch(@RequestBody CommonParam param){
        Map<String,List<ReportVO>> result = new HashMap<>();
        List<ReportVO> reportVOList = reportService.searchReportBywords(param.getSearchWord());
        result.put(ConstantEnum.REPORTLIST.getValue(),reportVOList);
        return RestResultGenerator.getRestSuccessResult(result);
    }

    //报告详情
    @RequestMapping(value = "/findbyid", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<ReportVO> reportDetail(@RequestBody CommonParam param){
        Map<String,List<ReportVO>> result = new HashMap<>();
        ReportVO report = reportService.findReportById(param.getUserId(), param.getReportId());
        return RestResultGenerator.getRestSuccessResult(report);
    }

    //报告收藏、取消收藏
    @RequestMapping(value = "/collect", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String,Object>> videoCollect(@RequestBody CommonParam param){
        ParamCheckUtils.checkParam(param.getIsCollect());
        if(param.getIsCollect()){
            reportService.collectReport(param.getUserId(),param.getReportId());
        }else {
            reportService.cancelCollectReport(param.getUserId(),param.getReportId());
        }
        Map<String, Object> result = BeanUtil.beanToMap(param, false, true);
        return RestResultGenerator.getRestSuccessResult(result);
    }

    //报告分享
    @RequestMapping(value = "/share", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String,Object>> reportShare(@RequestBody CommonParam param){
        reportService.reportShare(param.getUserId(),param.getReportId());
        Map<String, Object> result = BeanUtil.beanToMap(param, false, true);
        return RestResultGenerator.getRestSuccessResult(result);
    }

    //报告观看
    @RequestMapping(value = "/view", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<Map<String,Object>> reportView(@RequestBody CommonParam param){
        reportService.reportView(param.getUserId(),param.getReportId());
        Map<String, Object> result = BeanUtil.beanToMap(param, false, true);
        return RestResultGenerator.getRestSuccessResult(result);
    }

    //报告下载
    @RequestMapping(value = "/download", method = RequestMethod.POST, consumes = "application/json")
    @ControllerLog
    public RestResult<DownloadVO> reportDownload(@RequestBody CommonParam param){
        DownloadVO downloadVO = reportService.reportDownload(param.getUserId(), param.getReportId(), param.getPlatform());
        return RestResultGenerator.getRestSuccessResult(downloadVO);
    }
}