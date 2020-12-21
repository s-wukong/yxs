package cn.com.cig.cigrsbackend.service;
/**
* @Description: 访问aws s3的服务
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/10/12
*/

public interface AwsS3Service {

    /**
    * @Description: 指定objectkey和过期时间生成预定义签名
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/12
    */
    String generatePresignedURL(String objectKey,Long reportId,Long expirationInterval);

    /**
    * @Description: 从本地批量上传文件
    * @Param: localDir："D:\\cigrs_resource\\report_file"
    * @Param: s3KeyPrefix："dev/pdf/"
    * @return:
    * @Author: liushilei
    * @Date: 2020/10/19
    */
    void uploadOjbects(String localDir,String s3KeyPrefix);

    public void copyOjbect(String fromKey,String toKey);

}
