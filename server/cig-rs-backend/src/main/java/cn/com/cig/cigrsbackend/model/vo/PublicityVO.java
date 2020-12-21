package cn.com.cig.cigrsbackend.model.vo;

import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.model.dobj.PublicityDO;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.text.StrSpliter;
import lombok.Data;
import lombok.ToString;

import java.util.List;
/**
* @Description: 对应宣传接口的响应数据实体类‘
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/28
*/
@ToString
@Data
public class PublicityVO {
    private String reportAmounts;
    private String uploadDate;
    private Long addAmounts;
    private List<String> hotSearchWord;

    public static PublicityVO dOToVO(PublicityDO publicityDO){
        PublicityVO publicityVO = new PublicityVO();
        publicityVO.setReportAmounts(publicityDO.getReportAmounts());
        publicityVO.setUploadDate(DateUtil.date(publicityDO.getUploadTime()).toString("yyyy-MM"));
        publicityVO.setAddAmounts(publicityDO.getAddAmounts());
        //参数：被切分字符串，分隔符逗号，0表示无限制分片数，去除两边空格，忽略空白项
        publicityVO.setHotSearchWord(StrSpliter.split(publicityDO.getHotSearchWord(), ConstantEnum.SECONDTAGSEPARATOR.getValue(), 0, true, true));
        return  publicityVO;
    }
}