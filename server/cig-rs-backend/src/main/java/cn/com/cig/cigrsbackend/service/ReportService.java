package cn.com.cig.cigrsbackend.service;

import cn.com.cig.cigrsbackend.model.vo.*;

import java.util.List;
import java.util.Map;

/**
* @Description: report 服务接口
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/21
*/
public interface ReportService {


    /**
    * @Description: 查询在使用的报告宣传
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/28
    */
    public PublicityVO findUsePublicity();

    /**
     * @Description: 查询热推的报告
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/28
     */
    List<ReportVO> findHotReport();

    /**
    * @Description: 通过搜索报告的二级标签来搜索所有报告
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/28
    */
    List<ReportVO> searchReportBywords(String searchWords);

    /**
    * @Description: 报告详情
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/28
    */
    ReportVO findReportById(Long userId,Long reportId);

    /**
     * @Description: 收藏报告
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/28
     */
    void collectReport(Long userId,Long reportId);

    /**
     * @Description: 取消收藏报告
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/28
     */
    void cancelCollectReport(Long userId,Long reportId);

    /**
     * @Description: 报告分享
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/21
     */
    void reportShare(Long userId,Long reportId);

    /**
     * @Description: 报告观看
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/21
     */
    void reportView(Long userId,Long reportId);

    /**
    * @Description: 报告下载
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/12
    */
    DownloadVO reportDownload(Long userId, Long reportId, String platform);

    /**
     * 根据真实url获取短url时，返回转换实体
     * @param url
     * @return
     */
    TranlationVo getShortUrlByUrl(String url);

    /**
     * 根据短url获取真实url时，返回转换实体
     * @param shortUrl
     * @return
     */
    TranlationVo getUrlByShortUrl(String shortUrl);



}