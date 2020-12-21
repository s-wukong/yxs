import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { ButtonItem } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'
import jump, { clearUrl } from '@utils/jump'
import { getStorage } from '@utils/request'
import './index.scss'

import LOGO from "@assets/logo.png";

@connect(state => state.user, { ...actions })
class UserLogin extends Component {
  config = {
    navigationBarTitleText: '登录'
  }

  agreeAuth = () => {
    const that = this;
    const platform = process.env.TARO_ENV;
    Taro.login({
      success: function(res) {
        if (res.code) {
          Taro.getUserInfo({withCredentials:true}).then((data) => {
            const { errMsg, userInfo, encryptedData, iv } = data
            if (errMsg === 'getUserInfo:ok') {
              const sourceData = getStorage('UrlOptions').hasOwnProperty('sourceUserId') ? {sourceUserId: getStorage('UrlOptions').sourceUserId} : {};
              const payload = {
                "code": res.code,
                "platform": platform,
                "encryptedData": encryptedData,
                "iv": iv,
                ...sourceData
              };
              // console.log(payload,data,res)
              that.props.dispatchLogin(payload).then(v=>{
                if(v.Authorization){
                  Taro.showToast({
                    title: ` ${userInfo.nickName}，欢迎来到汽车数字化研享社～`,
                    icon: 'none'
                  })
                  
                  let URL = getStorage('Url');
                  let URL_OPTIONS = getStorage('UrlOptions');
                  if (URL === '/pages/database-detail/index'){
                    
                    console.log(URL,URL_OPTIONS,'redirectTo')
                    jump({
                      url: URL,
                      payload: URL_OPTIONS,
                      method: 'redirectTo',
                      reload: () => {
                        //清除保存起来的路由信息
                        clearUrl();
                      }
                    })
                  } else {
                    Taro.navigateBack({
                      delta: 1
                    })
                  }

                  // setTimeout(()=>{
                  //   // Taro.navigateBack({
                  //   //   delta: 1
                  //   // })

                  //   let URL = getStorage('Url');
                  //   let URL_OPTIONS = getStorage('UrlOptions');
                  //   if (URL === '/pages/index/index') {
                  //   // console.log(URL,URL_OPTIONS,'switchTab')
                  //     jump({
                  //       url: URL,
                  //       payload: URL_OPTIONS,
                  //       method: 'switchTab',
                  //       reload: () => {
                  //         //清除保存起来的路由信息
                  //         clearUrl();
                  //       }
                  //     })
                  //   } else {
                  //   // console.log(URL,URL_OPTIONS,'redirectTo')
                  //     jump({
                  //       url: URL,
                  //       payload: URL_OPTIONS,
                  //       method: 'redirectTo',
                  //       reload: () => {
                  //         //清除保存起来的路由信息
                  //         clearUrl();
                  //       }
                  //     })
                  //   }
                  // },1000)
                }
              })
            } else {
              Taro.showToast({
                title: '授权失败',
                icon: 'none'
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  }

  closeAuth = () => {
    Taro.navigateBack({
      delta: 1
    });
  }

  render () {

    return (
      <View className='user-login'>
        <View className='user-login__logo'>
          <Image src={LOGO} className='user-login__logo-img' />
        </View>
        {
          process.env.TARO_ENV === 'weapp'?
          <ButtonItem
            type='primary'
            text='微信登录'
            openType='getUserInfo'
            onGetUserInfo={this.agreeAuth}
          />:
            <ButtonItem
            type='primary'
            text='登录'
            openType='getUserInfo'
            onClick={this.agreeAuth}
          />          
        }
        <View className='closeAuthBtn' onClick={this.closeAuth}>取消</View>
      </View>
    )
  }
}

export default UserLogin
