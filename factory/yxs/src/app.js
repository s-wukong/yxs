//uma的依赖一定要放在最前面
import uma from './uma'

import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import fetch, { getStorage, updateStorage } from '@utils/request'
import { API_USER_LOGIN, API_USER_TOKEN } from '@constants/api'

import Index from './pages/index'

import configStore from './store'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

Taro.uma = uma;

const store = configStore()

class App extends Component {
  config = {
    pages: [
      'pages/index/index',
      'pages/vedioDetail/index',
      'pages/database/index',
      'pages/database-search/index',
      'pages/user/index',
      'pages/user-exp-intro/index',
      'pages/user-exp/index',
      'pages/user-money/index',
      'pages/user-edit/index',
      'pages/user-collect/index',
      'pages/user-download/index',
      'pages/user-login/index',
      'pages/user-protocol/index',
      'pages/database-detail/index',
      'pages/demo/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#ffffff',
      navigationBarTitleText: 'taro-super',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: "#666",
      selectedColor: "#666",
      backgroundColor: "#f6f6f6",
      borderStyle: 'white',
      list: [{
        pagePath: "pages/index/index",
        iconPath: "./assets/tab-bar/home.png",
        selectedIconPath: "./assets/tab-bar/home-active.png",
        text: "创想DAY"
      }, {
        pagePath: "pages/database/index",
        iconPath: "./assets/tab-bar/database.png",
        selectedIconPath: "./assets/tab-bar/database-active.png",
        text: "WIKI智库"
      }, {
        pagePath: "pages/user/index",
        iconPath: "./assets/tab-bar/user.png",
        selectedIconPath: "./assets/tab-bar/user-active.png",
        text: "我"
      }]
    },
    plugins: {
      "tencentvideo": {
        "version": "1.2.4",
        "provider": "wxa75efa648b60994b"
      }
    }
  }

  globalData = {
    uid: null
  }

  componentWillMount () {
    this.setUmaOpenId();
    //先判断是否为游客或者已授权
    const token = getStorage('token');
    if(token){
      //验证token是否失效
      fetch({ 
        url: API_USER_TOKEN, 
        payload:{
          "token": token
        }
      }).then(v=>{
        if(!v.isOk){
          //清空数据
          updateStorage({});
          this.loginIn();
        }else{
          this.globalData.uid = getStorage('uid');
        }
      });
    }else {
      this.loginIn();
    }
  }

  loginIn = () => {
    const that = this;
    const platform = process.env.TARO_ENV;
    const sourceUserId = platform !== 'swan'?Taro.getLaunchOptionsSync().query.sourceUserId:this.$router.params.query.sourceUserId;//处理百度小程序没有getLaunchOptionsSync函数的问题
    let sourceUserData = sourceUserId ? { sourceUserId: sourceUserId} : {};
    Taro.login({
      success: function(res) {
        if (res.code) {
            const payload = {
              "code": res.code,
              "platform": platform,
              ...sourceUserData
            };
            fetch({ 
              url: API_USER_LOGIN, 
              payload
            }).then(v=>{
              if(v.Authorization){
                that.globalData.uid = v.userId;
                that.setUmaOpenId(v.openId);
                Taro.showToast({
                  title: `欢迎来到汽车数字化研享社～`,
                  icon: 'none'
                })
              }
            });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  }

  setUmaOpenId = (v) => {
    if(v){
      Taro.uma.setOpenid(v);
      return;
    }
    //uma监测 判断本地是否存储有openid
    if(getStorage('openId')) Taro.uma.setOpenid(getStorage('openId'));
  }

  componentDidShow () {
    Taro.uma.trackEvent('pageView', {
      dp: 'app入口',
      dimension1: getStorage('openId')
    });
  }

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
