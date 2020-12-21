package cn.com.cig.cigrsbackend.model.vo;

import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.model.dobj.ReportDO;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.text.StrSpliter;
import lombok.Data;
import lombok.ToString;

import java.util.List;

/**
 * @Description: 响应前端报告对象对应的实体类
 * @Author: liushilei
 * @Version: 1.0
 * @Date: 2020/9/24
 */
@ToString
@Data
public class ReportVO {

    private Long id;
    private String title;
    private String author;
    private String uploadDate;
    private List<String> secondTag;
    private String bannerUrl;
    private Long viewCounts;
    private String collectTime;
    private String linkUrl;
    private Integer score;
    private Boolean isCollect;
    private Boolean isDownload;
    private Integer reportLevel;
    private String downLoadTime;

    public static ReportVO reportDOToReportVO(ReportDO reportDO,String cdnPrefix){
        ReportVO reportVO = new ReportVO();
        reportVO.setId(reportDO.getId());
        reportVO.setTitle(reportDO.getTitle());
        reportVO.setAuthor(reportDO.getAuthor());
        reportVO.setUploadDate(DateUtil.date(reportDO.getUploadTime()).toDateStr());
        //参数：被切分字符串，分隔符逗号，0表示无限制分片数，去除两边空格，忽略空白项
        reportVO.setSecondTag(StrSpliter.split(reportDO.getSecondTag(), ConstantEnum.SECONDTAGSEPARATOR.getValue(), 0, true, true));
        reportVO.setBannerUrl(cdnPrefix + reportDO.getBannerUrl());
        return reportVO;
    }
}