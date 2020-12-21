package cn.com.cig.cigrsbackend.model.vo;

import cn.com.cig.cigrsbackend.model.dobj.DownloadDO;
import lombok.Data;

import java.util.Objects;

/**
* @Description: app_report_download对应的实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/10/12
*/
@Data
public class DownloadVO {
    private Long userId;
    private Long reportId;
    private Long downloadTime;
    private String downloadLink;

    public static DownloadVO doToVo(DownloadDO downloadDO){
        DownloadVO downloadVO = new DownloadVO();
        downloadVO.setUserId(downloadDO.getUserId());
        downloadVO.setReportId(downloadDO.getReportId());
        downloadVO.setDownloadLink(downloadDO.getDownloadUrl());
        return downloadVO;
    }
}