package cn.com.cig.cigrsbackend.dao;

import cn.com.cig.cigrsbackend.model.dobj.PublicityDO;
import cn.com.cig.cigrsbackend.model.dobj.ReportDO;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
* @Description: 报告模块DAO层
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/27
*/
public interface ReportDao {
    
    /**
    * @Description: 查询使用的报告宣传
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/27
    */
    @Select("select * from app_report_publicity where is_use=1 limit 1")
    PublicityDO findUsePublicity();

    /**
    * @Description: 查询热推的报告
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/28
    */
    @Select("select * from app_report where is_hot = 1 order by order_key desc")
    List<ReportDO> findHotReport();

    /**
    * @Description: 根据关键词模糊匹配报告
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/28
    */
    @Select("select * from app_report where " +
            "second_tag like CONCAT('%',#{searchWord},'%') or " +
            "author like CONCAT('%',#{searchWord},'%') or " +
            "title like CONCAT('%',#{searchWord},'%') or " +
            "upload_date like CONCAT('%',#{searchWord},'%')")
    List<ReportDO> findReportListBySearchWord(String searchWord);

    /**
    * @Description: 根据报告ID查找报告
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/28
    */
    @Select("select * from app_report where id = #{reportId}")
    ReportDO  findReportByReportId(Long reportId);



}
