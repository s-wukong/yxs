package cn.com.cig.cigrsbackend.common;

/**
 * @author sunzb
 * @create 2020-11-24
 * @description 保存项目中用到的常量
 */
public interface CommonConstant {

    /**
     * 默认生成的短链接后缀长度
     */
    Integer LENGTH_OF_SHORT_URL = 6;

    /**
     * 若输入的短链接不存在，默认跳转的页面
     */
    String DEFAULT_URL = "http://error";
}
