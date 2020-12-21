package cn.com.cig.cigrsbackend.dao;


import cn.com.cig.cigrsbackend.CigRsBackendApplication;
import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.model.dobj.CollectDO;
import cn.com.cig.cigrsbackend.model.dobj.CommentDO;
import cn.com.cig.cigrsbackend.model.dobj.UserFeed;
import cn.com.cig.cigrsbackend.model.dobj.VideoDO;
import com.vdurmont.emoji.EmojiParser;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringEscapeUtils;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.net.URLEncoder;
import java.util.List;

import static cn.com.cig.cigrsbackend.constants.ConstantEnum.VIDEOCONTENTTYPE;
import static cn.com.cig.cigrsbackend.constants.ConstantEnum.VIEWFEEDTYPE;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest(classes = CigRsBackendApplication.class)
@EnableAutoConfiguration
@Slf4j
public class VideoDaoTest {

    private Long userId = 8L;
    private Long contentId = 3L;

    @Autowired
    VideoDao videoDao;

    @Autowired
    UserDao userDao;

    @Test
    public void findAllTest(){
        Long count = userDao.findActivityCountByContentId(1L, ConstantEnum.VIEWFEEDTYPE.getValue(), VIDEOCONTENTTYPE.getValue());
        log.error(count.toString());
    }

    @Test
    public void addShareRecordTest(){
        UserFeed userFeed = new UserFeed();
        userFeed.setUserId(userId);
        userFeed.setContentId(contentId);
        userFeed.setContentType(Integer.parseInt(VIDEOCONTENTTYPE.getValue()));
        userFeed.setFeedType(Integer.parseInt(VIEWFEEDTYPE.getValue()));
        userFeed.setFeedTime(System.currentTimeMillis());
        int status = userDao.addFeedRecord(userFeed);
        Assert.assertTrue(status > 0);
    }

    @Test
    public void findAllVideoTest(){
        List<VideoDO> allVideo = videoDao.findAllVideo();
        Assert.assertNotNull(allVideo);
    }

    @Test
    public void addCommentTest(){
        CommentDO commentDO = new CommentDO();
        commentDO.setFromUid(userId);
        commentDO.setFromUname("笑哈哈");
        commentDO.setCommentTime(System.currentTimeMillis());
        commentDO.setVideoId(3L);
        String commentContent = "\uD83D\uDE01 \uD83D\uDE02 辛苦想不到\uD83D\uDE0D \uD83D\uDE02";
        commentDO.setConmentContent(EmojiParser.parseToHtmlDecimal(commentContent));
        int status = videoDao.addComment(commentDO);
        Assert.assertTrue(status >= 0);
    }

    @Test
    public void addCollectRecordTest(){
        CollectDO collectDO = new CollectDO();
        collectDO.setUserId(userId);
        collectDO.setContentType(VIDEOCONTENTTYPE.getValue());
        collectDO.setContentId(1L);
        collectDO.setCollectTime(System.currentTimeMillis());
        int status = userDao.addCollectRecord(collectDO);
        Assert.assertTrue(status > 0);
    }

    @Test
    public void deleteCollectRecordTest(){
        CollectDO collectDO = new CollectDO();
        collectDO.setUserId(userId);
        collectDO.setContentType(VIDEOCONTENTTYPE.getValue());
        collectDO.setContentId(1L);
        int status = userDao.deleteCollectRecord(collectDO);
        Assert.assertTrue(status > 0);
    }

    @Test
    public void findAllCommentByVideoIdTest(){
        List<CommentDO> allCommentByVideoId = videoDao.findAllCommentByVideoId(3L);
        for(CommentDO commentDO : allCommentByVideoId){
            System.out.println(EmojiParser.parseToUnicode(commentDO.getConmentContent()));
        }
        log.error(allCommentByVideoId.toString());
    }




}