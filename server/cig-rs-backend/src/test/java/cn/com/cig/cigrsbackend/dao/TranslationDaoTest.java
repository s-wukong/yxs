package cn.com.cig.cigrsbackend.dao;

import cn.com.cig.cigrsbackend.CigRsBackendApplication;
import cn.com.cig.cigrsbackend.model.entity.TranslationEntity;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;


@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CigRsBackendApplication.class)
@EnableAutoConfiguration
@Slf4j

public class TranslationDaoTest {
    @Autowired
    TranslationDao translationDao;
//    @Test
//   public void findByShortUrlTest(){
//        long num = translationDto.findMaxNum();
//        Assert.assertNotNull(num);
//   }
   @Test
   public  void findByShortMD5Test(){
       List<TranslationEntity> list= translationDao.findByShortMD5("jMFFb2");
       Assert.assertNotNull(list);
   }

}
