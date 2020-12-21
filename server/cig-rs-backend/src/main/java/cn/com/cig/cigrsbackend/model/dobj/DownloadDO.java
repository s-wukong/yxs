package cn.com.cig.cigrsbackend.model.dobj;

import lombok.Data;

import java.util.Objects;

/**
* @Description: app_report_download对应的实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/10/12
*/
@Data
public class DownloadDO {
    private Long id;
    private Long userId;
    private Long reportId;
    private Long downloadTime;
    private String downloadUrl;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DownloadDO that = (DownloadDO) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(reportId, that.reportId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, reportId);
    }
}