package cn.com.cig.cigrsbackend.exception;


public class NotLoginException extends BasicException {
    public NotLoginException(ExceptionEnum exceptionEnum) {
        super(exceptionEnum);
    }
}
