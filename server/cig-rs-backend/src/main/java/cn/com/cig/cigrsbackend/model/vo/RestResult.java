package cn.com.cig.cigrsbackend.model.vo;

import lombok.Data;

import java.io.Serializable;

/**
* @Description: 请求成功返回给页面的json对象
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/23
*/
@Data
public class RestResult<T> implements Serializable {

    private T data; //响应数据

    private Integer status; //响应状态码

    private String message;

    public static <T> RestResult<T> newInstance() {
        return new RestResult<>();
    }

    private RestResult(){

    }

}