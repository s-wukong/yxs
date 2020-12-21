package cn.com.cig.cigrsbackend.utils.response;

import lombok.Data;

/**
 * @author sunzb
 * @create 2020-11-24
 * @description
 */
@Data
public class ResponseVo<T> {

    private Integer code;

    private String msg;

    private T data;
}
