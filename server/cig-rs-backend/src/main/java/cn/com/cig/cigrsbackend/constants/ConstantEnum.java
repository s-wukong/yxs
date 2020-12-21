package cn.com.cig.cigrsbackend.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum  ConstantEnum {
    DEFAULT_ROLE("USER"),
    AUTHORIZATION("Authorization"),
    SUCCESSSTATUS("200"),
    EMPTYSTRING(""),
    SECONDTAGSEPARATOR("|"),//二级标签分隔符
    SEARCHWORDSEPARATOR("\\ "),//搜索词分隔符
    VIDEOCONTENTTYPE("1"),//视频内容类型
    REPORTCONTENTTYPE("2"),//报告内容类型
    WXAPPLICATIONCONTENTTYPE("2"),//小程序内容类型
    VIDEOLIST("videos"),
    REPORTLIST("reports"),
    COMMENTLIST("comments"),
    VIEWFEEDTYPE("10"),
    LIKEFEEDTYPE("20"),
    SHAREFEEDTYPE("30");

    private String value;

}
