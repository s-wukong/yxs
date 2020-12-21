package cn.com.cig.cigrsbackend.model.dobj;

import lombok.Data;
import lombok.ToString;

/**
* @Description: app_report_publicity对应的宣传实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/27
*/
@Data
@ToString
public class PublicityDO {

    private Long id;
    private String projectName;
    private String reportAmounts;
    private Long uploadTime;
    private Long addAmounts;
    private String hotSearchWord;
    private Integer isUse;
}