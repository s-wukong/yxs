package cn.com.cig.cigrsbackend.service;

import cn.com.cig.cigrsbackend.CigRsBackendApplication;
import cn.hutool.core.lang.Assert;
import cn.hutool.http.HttpUtil;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static cn.com.cig.cigrsbackend.utils.CigDateUtil.currentTimeStamp;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CigRsBackendApplication.class)
@EnableAutoConfiguration
@Slf4j
public class AwsS3ServiceImplTest {

    @Autowired
    AwsS3Service awsS3Service;

    @Test
    public void generatePresignedURLTest(){
        String url = awsS3Service.generatePresignedURL("/pdf/1000002.pdf",1000002L,1000000L);
        Assert.notNull(HttpUtil.get(url));
    }

    @Test
    public void copyOjbectTest(){
        Long reportId = 1000002L;
        awsS3Service.copyOjbect("dev/pdf/1000002.pdf","dowload-dev/pdf/"+currentTimeStamp() + "-" + reportId + ".pdf");
    }

}