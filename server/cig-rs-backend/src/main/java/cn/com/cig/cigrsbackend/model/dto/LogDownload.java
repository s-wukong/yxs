package cn.com.cig.cigrsbackend.model.dto;

import lombok.Data;

@Data
public class LogDownload {
    private String url;
    private String browserName;
    private String osName;
    private String getIpAddress;
    private String userAgent;
    private String shortUrl;
}
