package cn.com.cig.cigrsbackend.model.dobj;

import lombok.Data;
import lombok.ToString;

import java.util.Objects;

/**
* @Description: app_report对应的实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/24
*/
@Data
@ToString
public class ReportDO {

    private Long id;
    private String title;
    private String author;
    private Long uploadTime;
    private String uploadDate;
    private String secondTag;
    private String bannerUrl;
    private Long orderKey;
    private Integer score;
    private Integer isHot;
    private String linkUrl;
    private Long collectTime;
    private Integer reportLevel;
    private Long downloadTime;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ReportDO reportDO = (ReportDO) o;
        return id.equals(reportDO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}