package cn.com.cig.cigrsbackend.model.entity;

import lombok.Data;


/**
 * @author sunzb
 * @create 2020-11-24
 * @description
 */
@Data
public class TranslationEntity {

    private Long id;
    /**
     * 真实url（长链）
     */
    private String url;

    /**
     * 转换url（短链）
     */
    private String shortUrl;
    /**
     * 进行md5加密获得短码
     */
    private String shortMD5;

}
