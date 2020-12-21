package cn.com.cig.cigrsbackend.dao;

import cn.com.cig.cigrsbackend.model.entity.TranslationEntity;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author sunzb
 * @create 2020-11-24
 * @description
 */
@Repository
public interface TranslationDao {

    /**
     * 根据shortUrl获取对应的转换实体
     * @param shortUrl
     * @return
     */
    @Select("select * from translation_entity where short_url = #{shortUrl}")
    TranslationEntity findByShortUrl(String shortUrl);

    @Select("select * from translation_entity where shortmd5 = #{shortMD5}")
    List<TranslationEntity> findByShortMD5(String shortMD5);

    /**
     * 获取已存储的URL总数，则该数值+1即为短链生成时所使用的那个最新id
     * @return
     */
    @Insert("Insert into translation_entity (short_url,url,shortmd5) values(#{shortUrl} ,#{url},#{shortMD5})")
    @Options(useGeneratedKeys = true, keyProperty = "id",keyColumn = "id")
    int saveTranslation(TranslationEntity translationEntity);

    /**
     * 更新TranslationEntity
     * @param translationEntity
     * @return
     */
    @Update("update translation_entity set short_url= #{shortUrl},url=#{url},shortmd5=#{shortMD5} where id = #{id}")
    int updateTranslation(TranslationEntity translationEntity);
}
