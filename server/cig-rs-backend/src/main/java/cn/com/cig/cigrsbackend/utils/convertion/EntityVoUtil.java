package cn.com.cig.cigrsbackend.utils.convertion;

import cn.com.cig.cigrsbackend.model.entity.TranslationEntity;
import cn.com.cig.cigrsbackend.model.vo.TranlationVo;

/**
 * @author sunzb
 * @create 2020-11-24
 * @description
 */
public abstract class EntityVoUtil {

    public static TranlationVo convertEntityToVo(TranslationEntity translationEntity) {
        TranlationVo tranlationVo = new TranlationVo();
        tranlationVo.setUrl(translationEntity.getUrl());
        tranlationVo.setShortUrl(translationEntity.getShortUrl());
        return tranlationVo;
    }
}
