package cn.com.cig.cigrsbackend.model.dto;

import lombok.Data;

import java.io.Serializable;
/**
* @Description: 日志实体类
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/10/16
*/
@Data
public class OperationLog implements Serializable {


    private static final long serialVersionUID = 7087799444017468909L;

    private String id;
    private String userId;
    private String nickName;
    private String operationMethod;
    private String param;
    private String operationDate;

}