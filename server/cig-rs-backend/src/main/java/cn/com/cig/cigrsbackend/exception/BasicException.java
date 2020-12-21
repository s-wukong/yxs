package cn.com.cig.cigrsbackend.exception;


import lombok.Getter;

@Getter
public class BasicException extends RuntimeException {
    private Integer status;
    private String type;

    public BasicException(ExceptionEnum exceptionEnum) {
        super(exceptionEnum.getMessage());
        this.status = exceptionEnum.getStatus();
        this.type = exceptionEnum.getType();
    }

}
