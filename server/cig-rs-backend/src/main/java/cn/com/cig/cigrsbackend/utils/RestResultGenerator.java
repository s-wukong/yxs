package cn.com.cig.cigrsbackend.utils;


import cn.com.cig.cigrsbackend.constants.ConstantEnum;
import cn.com.cig.cigrsbackend.model.vo.RestResult;
import lombok.extern.slf4j.Slf4j;

/**
* @Description: 成功响应json生成
* @Author: liushilei
* @Version: 1.0
* @Date: 2020/9/23
*/
@Slf4j
public class RestResultGenerator {


	/**
	* @Description: 给定状态码和数据生成响应结果
	* @Param:
	* @return:
	* @Author: liushilei
	* @Date: 2020/9/23
	*/
	public static <T> RestResult<T> getRestResult(Integer status, T data) {
		RestResult<T> result = RestResult.newInstance();
		result.setStatus(status);
		result.setData(data);
		return result;
	}

	/**
	* @Description: 给定数据，自动填入状态码
	* @Param:
	* @return:
	* @Author: liushilei
	* @Date: 2020/9/23
	*/
	public static <T> RestResult<T> getRestSuccessResult(T data) {
		if (data == null) {
			return getNoDateResult();
		}
		return getRestResult(Integer.parseInt(ConstantEnum.SUCCESSSTATUS.getValue()),data);
	}

	/**
	* @Description: 无数据的情况下的成功响应
	* @Param:
	* @return:
	* @Author: liushilei
	* @Date: 2020/9/23
	*/
	public static <T> RestResult<T> getNoDateResult() {
		return getRestResult(Integer.parseInt(ConstantEnum.SUCCESSSTATUS.getValue()), null);
	}
}
