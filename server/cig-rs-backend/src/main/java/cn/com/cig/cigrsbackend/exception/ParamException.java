package cn.com.cig.cigrsbackend.exception;


public class ParamException extends BasicException {
    public ParamException(ExceptionEnum exceptionEnum) {
        super(exceptionEnum);
    }
}
