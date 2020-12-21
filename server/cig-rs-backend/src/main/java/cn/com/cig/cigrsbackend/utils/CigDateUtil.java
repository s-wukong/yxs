package cn.com.cig.cigrsbackend.utils;

import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUnit;
import cn.hutool.core.date.DateUtil;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

public class CigDateUtil {
    private CigDateUtil(){

    }
    private static TimeZone timeZone = TimeZone.getTimeZone("GMT+8:00");
    private static Calendar cal = Calendar.getInstance(timeZone);

    /**
     * @Description: 判断时间点是否处于今天
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/9/23
     */
    public static Boolean judgeTimeIsInToday(Long time){
        //得到今天的开始，也就是今天的00:00:00
        DateTime startTime = DateUtil.beginOfDay(new Date());
        //得到今天的结尾，也就是今天的23:59:59
        DateTime endTime = DateUtil.endOfDay(new Date());

        //isIn(我们要判断的时间点，开始时间， 结束时间)
        //是个闭区间,也就是时间点等于开始时间和结束时间，都算在这个时间段范围内
        return DateUtil.isIn(DateUtil.date(time),startTime,endTime);
    }

    /**
     * @Description: 获取当前周的开始时间戳
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/10/13
     */
    public static Long currentWeekBeginTimeStamp(){
        return DateUtil.beginOfWeek(new Date()).getTime();
    }

    /**
     * @Description: 获取当前天的结束时间戳
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/10/13
     */
    public static Long currentDayEndTimeStamp(){
        return DateUtil.endOfDay(new Date()).getTime();
    }

    /**
     * @Description: 获取当前天的开始时间戳
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/10/13
     */
    public static Long currentDayBeginTimeStamp(){
        return DateUtil.beginOfDay(new Date()).getTime();
    }

    /**
     * @Description: 获取当前时间戳
     * @Param:
     * @return:
     * @Author: liushilei
     * @Date: 2020/10/13
     */
    public static Long currentTimeStamp(){
        return new Date().getTime();
    }


    public static String getDurationString(String duration){
        long durationLong = Long.parseLong(duration);
        Long hour = durationLong/3600;
        Long minute = durationLong%3600/60;
        Long second = durationLong%60;
        String secondStr = second.equals(0L) ? "00" : String.valueOf(second);
        if(hour.equals(0L)){
            if(minute.equals(0L)){
                return "00:"+secondStr;
            }else {
                if(minute > 9){
                    return minute+":"+secondStr;
                }else {
                    return "0"+minute+":"+secondStr;
                }
            }
        }else {
            if(minute > 9){
                return hour+":"+minute+":"+secondStr;
            }else {
                return hour+":0"+minute+":"+secondStr;
            }
        }
    }




}