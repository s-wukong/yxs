package cn.com.cig.cigrsbackend.dao;

import cn.com.cig.cigrsbackend.CigRsBackendApplication;
import cn.com.cig.cigrsbackend.model.entity.TranslationEntity;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;


@RunWith(SpringJUnit4ClassRunner.class)
@EnableAutoConfiguration
@Slf4j
@SpringBootTest(classes = CigRsBackendApplication.class)
public class UserTestDaoTest {
    @Autowired
    TranslationDao translationDao;


}
