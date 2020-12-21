package cn.com.cig.cigrsbackend.service.impl;

import cn.com.cig.cigrsbackend.exception.BasicException;
import cn.com.cig.cigrsbackend.exception.ExceptionEnum;
import cn.com.cig.cigrsbackend.service.AwsS3Service;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.transfer.MultipleFileUpload;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerBuilder;
import lombok.extern.slf4j.Slf4j;
import org.jets3t.service.CloudFrontService;
import org.jets3t.service.CloudFrontServiceException;
import org.jets3t.service.utils.ServiceUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;


import java.io.*;
import java.security.Security;
import java.util.Date;

import static cn.com.cig.cigrsbackend.utils.CigDateUtil.currentTimeStamp;

@Slf4j
@Service
public class AwsS3ServiceImpl implements AwsS3Service {

    @Autowired
    private AmazonS3 s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Value("${cdndl.prefix}")
    private String cdnDlPrefix;

    @Value("${aws.cloudfront.key_pair_id}")
    private String keyPairId;

    @Value("${s3.env.dl}")
    private String s3DlEnv;

    @Value("${s3.env}")
    private String s3Env;

    private static byte[] derPrivateKey = getCloudFrontPrivateKeyBytes();


    @Override
    public String generatePresignedURL(String objectKey,Long reportId,Long expirationInterval) {
        //首先对pdf文件进行复制
        String toKey = "/pdf/" + currentTimeStamp() + "-" + reportId + ".pdf";
        copyOjbect(s3Env + objectKey,s3DlEnv + toKey);
        //待签名的URL
        String policyResourcePath = cdnDlPrefix + toKey;
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += expirationInterval;
        expiration.setTime(expTimeMillis);
        log.info("开始为[{}]生成预签名URL",policyResourcePath);
        //加载Hash和签名算法类
        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
        String signedUrlCanned = null;
        try {
            signedUrlCanned = CloudFrontService.signUrlCanned(
                    policyResourcePath,
                    keyPairId,     // Certificate identifier,
                    // an active trusted signer for the distribution
                    derPrivateKey, // DER Private key data
                    expiration // DateLessThan
            );
        } catch (CloudFrontServiceException e) {
            log.error("连接cloudfront生成签名URL失败！连接超时！！！，目标对象为[{}]",policyResourcePath);
        }
        log.info("预签名URL: " + signedUrlCanned.toString());
        return signedUrlCanned.toString();
    }

    /**
     * @Description: 获取CloudFront的私钥文件
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/11/6
     */
    private static byte[] getCloudFrontPrivateKeyBytes() {


        //直接将目标文件读成inputstream  this指当前类的实例对象
        InputStream ins = AwsS3ServiceImpl.class.getClassLoader().getResourceAsStream("cloudfront_key.der");
        String privateKeyFilePath = ResourceUtils.CLASSPATH_URL_PREFIX + "cloudfront_key.der";

        //加载私钥文件内容
        byte[] derPrivateKey = new byte[0];
        try {
            derPrivateKey = ServiceUtils.readInputStreamToBytes(ins);
        } catch (IOException e) {
            log.error("cloudfront的私有密钥有误！[{}]",privateKeyFilePath);
        }
        return derPrivateKey;
    }

    @Override
    public void uploadOjbects(String localDir,String s3KeyPrefix) {
        TransferManager transferManager = TransferManagerBuilder.standard().withS3Client(s3Client).build();
        File dir = new File(localDir);
        MultipleFileUpload upload = transferManager.uploadDirectory(bucketName, s3KeyPrefix, dir, true);
        try {
            upload.waitForCompletion();
        } catch (InterruptedException e) {
            log.error("批量上传文件失败！本地上传目录:[{}],s3目标目录：[{}]",localDir,s3KeyPrefix);
            log.error("错误消息：{}",e.getMessage(),e);
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("上传文件失败"));
        }
    }

    public void copyOjbect(String fromKey,String toKey){
        try {
            s3Client.copyObject(bucketName,fromKey,bucketName,toKey);
        } catch (AmazonServiceException e) {
            log.error("生成pdf下载链接中-复制pdf失败：fromkey:{},tokey:{}",fromKey,toKey);
            throw new BasicException(ExceptionEnum.SERVER_EXCEPTION.customMessage("生成下载链接过程中复制pdf失败！"));
        }

    }

}