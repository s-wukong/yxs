package cn.com.cig.cigrsbackend.utils;

import cn.com.cig.cigrsbackend.model.dobj.UserDO;
import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUnit;
import cn.hutool.core.date.DateUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.codehaus.xfire.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.AlgorithmParameters;
import java.security.Security;
import java.util.Arrays;
import java.util.Date;

@Slf4j
public class WxUtil {

    private WxUtil() {

    }

    /**
    * @Description: 将前端传过来的用户加密数据解密并转成JSONObject
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/22
    */
    public static JSONObject getUserInfo(String encryptedData,String sessionkey,String iv){
        // 被加密的数据
        byte[] dataByte = Base64.decode(encryptedData);
        // 加密秘钥
        byte[] keyByte = Base64.decode(sessionkey);
        // 偏移量
        byte[] ivByte = Base64.decode(iv);
        try {
            // 如果密钥不足16位，那么就补足.  这个if 中的内容很重要
            int base = 16;
            if (keyByte.length % base != 0) {
                int groups = keyByte.length / base + (keyByte.length % base != 0 ? 1 : 0);
                byte[] temp = new byte[groups * base];
                Arrays.fill(temp, (byte) 0);
                System.arraycopy(keyByte, 0, temp, 0, keyByte.length);
                keyByte = temp;
            }
            // 初始化
            Security.addProvider(new BouncyCastleProvider());
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS7Padding","BC");
            SecretKeySpec spec = new SecretKeySpec(keyByte, "AES");
            AlgorithmParameters parameters = AlgorithmParameters.getInstance("AES");
            parameters.init(new IvParameterSpec(ivByte));
            cipher.init(Cipher.DECRYPT_MODE, spec, parameters);// 初始化
            byte[] resultByte = cipher.doFinal(dataByte);
            if (null != resultByte && resultByte.length > 0) {
                String result = new String(resultByte, "UTF-8");
                return JSONUtil.parseObj(result);
            }
        } catch (Exception e) {
           log.error("用户数据解密失败");
            e.printStackTrace();
        }
        return null;
    }

    /**
    * @Description: 将JSONObject转为UserDO对象
    * @Param:
    * @return:
    * @Author: liushilei
    * @Date: 2020/9/22
    */
    public static UserDO jsonObjectToUserDO(JSONObject jsonObject){
        UserDO user = new UserDO();
        user.setOpenId(jsonObject.getStr("openId"));
        user.setUnionId(jsonObject.getStr("unionId"));
        user.setNickName(jsonObject.getStr("nickName"));
        user.setAvatarUrl(jsonObject.getStr("avatarUrl"));
        return user;
    }

}


