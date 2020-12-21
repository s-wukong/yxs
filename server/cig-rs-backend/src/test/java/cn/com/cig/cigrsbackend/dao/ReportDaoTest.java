package cn.com.cig.cigrsbackend.dao;


import cn.com.cig.cigrsbackend.CigRsBackendApplication;
import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.model.dobj.*;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

import static cn.com.cig.cigrsbackend.constants.ConstantEnum.VIDEOCONTENTTYPE;
import static cn.com.cig.cigrsbackend.constants.ConstantEnum.VIEWFEEDTYPE;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CigRsBackendApplication.class)
@EnableAutoConfiguration
@Slf4j
public class ReportDaoTest {

    private Long userId = 8L;

    @Autowired
    ReportDao reportDao;

    @Test
    public void findUsePublicityTest(){
        PublicityDO usePublicity = reportDao.findUsePublicity();
        System.out.println(usePublicity);
        Assert.assertNotNull(usePublicity);
    }

    @Test
    public void findReportListBySearchWord(){
        List<ReportDO> reportDOList = reportDao.findReportListBySearchWord("test");
        Assert.assertNotNull(reportDOList);
    }

}