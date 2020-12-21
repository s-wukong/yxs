package cn.com.cig.cigrsbackend.service.impl;

import cn.com.cig.cigrsbackend.dao.TimedTaskDao;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
@Slf4j
@Component
@Service
//设置定时任务删除过期数据
public class TimedTaskServiceImpl {
    @Resource
    private TimedTaskDao timedTaskDao;
    Logger logger = LoggerFactory.getLogger(TimedTaskServiceImpl.class);
    //每天凌晨一点删除过期3天的数据
    @Scheduled(cron = "0 0 1 * * ?")
    public void scheduled() {
        try{
            timedTaskDao.deleteByDate();
            logger.info("删除成功");
        }catch (Exception e){
            logger.error("删除数据失败！"+e);
        }

    }

}
