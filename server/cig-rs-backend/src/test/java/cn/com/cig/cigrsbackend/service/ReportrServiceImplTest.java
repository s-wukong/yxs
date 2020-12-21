package cn.com.cig.cigrsbackend.service;

import cn.com.cig.cigrsbackend.CigRsBackendApplication;
import cn.com.cig.cigrsbackend.model.dobj.UserDO;
import cn.com.cig.cigrsbackend.model.vo.DownloadVO;
import cn.com.cig.cigrsbackend.model.vo.UserVO;
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.Map;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CigRsBackendApplication.class)
@EnableAutoConfiguration
@Slf4j
public class ReportrServiceImplTest {

    private Long userId = 6L;
    private Long reportId = 1000558L;
    private String platform = "weapp";

    @Autowired
    ReportService reportService;

    @Test
    public void reportDownloadTest(){
        DownloadVO downloadVO = reportService.reportDownload(userId, reportId, platform);
        Assert.assertNotNull(downloadVO);
    }


}