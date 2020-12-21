package cn.com.cig.cigrsbackend.service;

import cn.com.cig.cigrsbackend.CigRsBackendApplication;
import cn.com.cig.cigrsbackend.model.dobj.UserDO;
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
public class UserServiceImplTest {

    private Long userId = 8L;

    @Autowired
    UserService userService;


    @Test
    public void findUserByOpenId(){
        UserDO user = userService.findUserByOpenId("eeee");
        UserVO userVO = UserVO.UserDOToUserVo(user);
        Map<String, Object> stringObjectMap = BeanUtil.beanToMap(userVO,false,true);
        System.out.println(stringObjectMap);
        Assert.assertNotNull(user);
    }

    @Test
    public void registerTest(){
        UserDO user = new UserDO();
        user.setOpenId("xxxx");
        user.setUnionId("sssss");
        user.setAvatarUrl("https://cigdata.cdn.dev/");
        user.setNickName("小吴");
        user = userService.register(user);
        Assert.assertTrue(user.getUserId() > 0);
    }

    @Test
    public void findUserByUserIdTest(){
        UserVO userByUserId = userService.findUserByUserId(userId);
        System.out.println(JSONUtil.toJsonStr(BeanUtil.beanToMap(userByUserId,false,true)));
    }


}