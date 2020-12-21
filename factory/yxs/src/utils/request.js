import Taro from '@tarojs/taro'
import { API_USER_FINDUSER, API_USER_LOGIN, API_USER_TOKEN, API_VEDIO_COMMENT_COMMIT } from '@constants/api'

import cigTracker from './../ciga/cig_miniSDK_weixin.js'

const CODE_SUCCESS = 200
const CODE_AUTH_EXPIRED = 40301
const CODE_SERVER_ERROR = 50000
//登陆失败
const CODE_LOGIN_PARAMS_FAILED = 40001
const CODE_LOGIN_SERVER_ERROR = 50002

export const getStorage = (key) => {
  // console.log( Taro.getStorageSync( key ))
  return Taro.getStorageSync( key )
  // return Taro.getStorageSync({ key }).then(res => res.data).catch(() => '')
}

export const updateStorage = (data = {}) => {
  return Promise.all([
    Taro.setStorage({ key: 'token', data: data['Authorization'] || '' }),
    Taro.setStorage({ key: 'uid', data: data['userId'] || ''}),
    Taro.setStorage({ key: 'openId', data: data['openId'] || ''}),
    Taro.setStorage({ key: 'nickName', data: data['nickName'] || ''})
  ])
}

/**
 * 简易封装网络请求
 * // NOTE 需要注意 RN 不支持 *StorageSync，此处用 async/await 解决
 * @param {*} options
 */
export default async function fetch(options) {
  const { url, payload, method = 'POST', showToast = true, autoLogin = true } = options
  const uid = await getStorage('uid')
  const token = await getStorage('token')
  const header = token && url !== API_USER_LOGIN && url !== API_USER_TOKEN ? { 'Authorization': token } : {}
  if (method === 'POST') {
    header['content-type'] = 'application/json'
  }

  if(url === API_USER_LOGIN){
    header['content-type'] = 'application/x-www-form-urlencoded;charset=utf-8'
  }

  let userData = {};

  if (url !== API_USER_LOGIN && url !== API_USER_TOKEN) {
    // console.log(getStorage('uid'),'getStorage')
    userData = {
      userId: uid
    }
  }

  // console.log(url, payload, method)
  return Taro.request({
    url,
    method,
    data: {
      ...payload,
      ...userData
    },
    header
  }).then(async (res) => {
    const { status, data } = res.data
    // console.log(res)

    if (status !== CODE_SUCCESS) {
      if (status === CODE_AUTH_EXPIRED) {
        await updateStorage({})
        //直接跳转到登陆页重新登陆；
      }
      //注意后面测试是否调整 添加调整
      return Promise.reject(res.data)
    }

    if (url === API_USER_LOGIN) {
      await updateStorage(data)
    }

    //视频评论
    if(status === CODE_LOGIN_PARAMS_FAILED && url === API_VEDIO_COMMENT_COMMIT) {
      Taro.showToast({
        title: res.message,
        icon: 'none'
      })
    }

    // 用户信息需展示
    // if (url === API_USER_FINDUSER) {
    //   const uid = await getStorage('uid')
    //   return { ...data, uid }
    // }
    return data
  }).catch((err) => {
    console.log(err)
    const defaultMsg = err.status === CODE_AUTH_EXPIRED ? '登录失效' : '请求异常'
    if (showToast) {
      Taro.showToast({
        title: err && err.message || defaultMsg,
        icon: 'none'
      })
    }

    //  不让强制登陆
    // if (err.status === CODE_AUTH_EXPIRED && autoLogin) {
    //   Taro.navigateTo({
    //     url: '/pages/user-login/index'
    //   })
    // }

    return Promise.reject({ message: defaultMsg, ...err })
  })
}

/**
 * 游客状态下授权登陆 还得需要使用getUserInfo的button 暂时跳转到登陆页
 */
export const goAuth = () => {
  Taro.navigateTo({
    url: '/pages/user-login/index'
  })
  //授权
  // const that = this;
  // Taro.login({
  //   success: function(res) {
  //     if (res.code) {
  //       Taro.getUserInfo({withCredentials:true}).then((data) => {
  //         const { errMsg, encryptedData, iv } = data
  //         if (errMsg === 'getUserInfo:ok') {
  //           const payload = {
  //             "code": res.code,
  //             "encryptedData": encryptedData,
  //             "iv": iv,
  //           };
  //           // console.log(payload,data,res)
  //           that.props.dispatchLogin(payload).then(v=>{
  //             if(v.Authorization){
  //               Taro.showToast({
  //                 title: `授权成功～`,
  //                 icon: 'none'
  //               })
  //             }
  //           })
  //         } else {
  //           Taro.showToast({
  //             title: '授权失败',
  //             icon: 'none'
  //           })
  //         }
  //       })
  //     } else {
  //       console.log('登录失败！' + res.errMsg)
  //     }
  //   }
  // });
}

/**
 * 处理app.js加载全局数据时异步慢的问题 延时加载数据
 */
export const delayLoad = (time, func) => {
  const app = Taro.getApp();
  if(app.globalData.uid){
    //处理百度onShow加载超前于dispatch的时效问题
    if(process.env.TARO_ENV === 'swan'){
      setTimeout(()=>{
        func();
      },1500);
    }else{
      func();
    }
    // sendCiga();//发送ciga监测
  }else{
    //心跳机制
    let sendType = false;
    let sendTime = 0;
    let heartBeat = setInterval(()=>{
      sendTime++;
      if(app.globalData.uid && !sendType){
        sendType = true;
        func();
        // sendCiga();//发送ciga监测
      }
      if(!sendType && sendTime=== time){
        sendType = true;
        clearInterval(heartBeat);
      }
      if(sendType) clearInterval(heartBeat);
    },1000)
  }
}

/**
 * 发送ciga监测
 */
export const replaceStr = (str) => {
  // return str;
  return str.replace(/</g,' ').replace(/>/g,' ');
}
export const sendCiga = (t='pv',obj={}) => {
  let sysInfo = Taro.getSystemInfoSync();
  console.log(sysInfo)
  // 小程序 openid 需调后台接口才能获取 暂时测试
  var uid = "";
  if(getStorage('openId')){
    uid = getStorage('openId');
  }
  console.log('uid',uid)
  var cid = "224283724";
  // 使用uid和session开始时间计算sid
  // var sid = "badmintonisasporteverybodyshx156";
  var sid = cigTracker.getSessionId();
  console.log('sid',sid)
  var url = "https://cachi.cigdata.cn/v2/events";

  let event_list = [];
  // event_list.push(pv_event);
  // event_list.push(click_event);

  if(t === 'pv'){
    var pv_event = {
      "id": 0,
      "x": 0,
      "p": 0,
      "d": {
        "name": "车豆豆选车助手首页",
        "content": "/pages/index/",
        "source": {
          "protocol": "https",
          "domain": "hanbing-test-cdn.s3.cn-north-1.amazonaws.com.cn",
          "path": "/cigtest.html"
        },
        "payload": {
          "interactive": 151,
          "dcl": 151,
          "dp":'/index',
          "dimension1": uid,
          ...obj
        },
        "generationTime": 78,
        "m": true,
        "url": "https://hanbing-test-cdn.s3.cn-north-1.amazonaws.com.cn/cigTest.html",
        "t": "车豆豆选车助手首页",
        "dtm": new Date().getTime(),
        "sz": {
          "w": sysInfo.screenWidth,
          "h": sysInfo.screenHeight
        },
        "f": 'document.referrer',
        "et": 18
      },
      "t": new Date().getTime() - Taro.getStorageSync('startTime')
    };
    if(uid){
      pv_event['d']['userId'] = uid;
    }
    event_list.push(pv_event);
  }else{
    var click_event = {
      "id": 0,
      "x": 0,
      "p": 0,
      "d": {
        "name": "click",
        "content": "clickBtn1",
        "source": {
          "protocol": "https",
          "domain": "hanbing-test-cdn.s3.cn-north-1.amazonaws.com.cn",
          "path": "/cigtest.html"
        },
        "payload": {
          "t": "车豆豆选车助手首页",
          "eventCategory": "C01_首页CLICK",
          "eventAction": "点击",
          "eventLabel": "view",
          "dimension1": uid,
          ...obj
        },
        "et": 15
      },
      "t": new Date().getTime() - Taro.getStorageSync('startTime')
    };
    if(uid){
      click_event['d']['userId'] = uid;
    }
    event_list.push(click_event);
  }
  let referrer = '';
  let UA = '';
  if(!sysInfo.system.includes('iOS')){
    //android
    UA = `Mozilla/5.0 (${replaceStr(sysInfo.system)}; ${replaceStr(sysInfo.model)} Build/${replaceStr(sysInfo.brand)} ${replaceStr(sysInfo.model)}) MicroMessenger/${sysInfo.version}`
  }else{
    // ios
    UA = `Mozilla/5.0 (${replaceStr(sysInfo.brand)} ${replaceStr(sysInfo.system.slice(1))} ${replaceStr(sysInfo.model)}) AppleWebKit/605.1.15 (KHTML, like Gecko) MicroMessenger/${sysInfo.version}`
  }
  console.log('UA',UA)
  let dataSource = 'WexinMini'; //sysInfo.appName === 'Douyin'?'DouyinMini':'ToutiaoMini';
  let data = cigTracker.assembleCigEvent(uid, sid, cid, event_list, referrer, UA, dataSource);
  console.log('data', data);
  Taro.request({
    url: `${url}`,
    data: data,
    method: 'POST',
    // url: 'https://tools.cigdata.cn/login',
    header: {
      'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyMjQyODM3MjMiLCJpYXQiOjE1OTgzODgzNDB9.SjbOwwvMHWc4cbefvUnmPLZ6w1IYAXbv83KMEmjQgEo',
      "Content-Type": "application/json"
    },
    success: () => {
      // wx.showToast({
      //   title: res.data.status,
      // })
      console.log('succuss');
    },
    fail: () => {
      // wx.showToast({
      //   title: res.data.status,
      // })
      console.log('failed');
    }
  })
}