import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'
import jump from '@utils/jump'
import fetch, { getStorage, goAuth } from '@utils/request'
import { API_USER_ADDSCORE } from '@constants/api'
import SHARE_IMG from '@assets/share_img.png'
import SHARE_COPYWRITING from '@constants/constant'
// import { getWindowHeight } from '@utils/style'
import './index.scss'

@connect(state => state.user, { ...actions })
class User extends Component {
  config = {
    navigationBarTitleText: '汽车数字化研享社'
  }

  state = {
    loaded: false,
    loading: false,
    isSign:false
  }

  componentDidShow() {
    // Taro.showToast({
    //   title: '提示信息',
    //   icon: 'none',
    //   duration: 6000
    // })

    //处理百度onShow加载超前于dispatch的时效问题
    if(process.env.TARO_ENV === 'swan'){
      setTimeout(()=>{
        this.props.dispatchGetUser().then((res) => {
          this.setState({ loaded: true })
        })
      },1500)
    }else{
      this.props.dispatchGetUser().then((res) => {
        this.setState({ loaded: true })
      })
    }

  }

  sign = () => {
    const { isSignIn } = this.props;
    if(isSignIn) return;

    this.props.dispatchSignIn().then((res) => {
      console.log(res)
      //请求签到接口
      Taro.showToast({
        title: '签到成功 粒子+10',
        icon: 'none'
      })
    })

  }

  goDetail = (page) => {
    jump({ 
      url: `/pages/${page}/index`
    })
  }

  goShow = () => {
    Taro.showToast({
      title: '暂未开放，敬请期待',
      icon: 'none'
    })
  }

  onShareAppMessage = () => {
    const uid = getStorage('uid');
    //分享小程序加经验接口
    fetch({ 
      url: API_USER_ADDSCORE, 
      payload: {
        "scoreType": 22
      }
    });
    return {
      title: SHARE_COPYWRITING,
      imageUrl: SHARE_IMG,
      path: `/pages/index/index?from=sharebutton&sourceUserId=${uid}`
    }
  }

  goLogin = () => {
    goAuth();
  }

  copyTxt = () => {
    Taro.setClipboardData({
      data: 'autodigital-2020',
      success: function () {
        Taro.getClipboardData({
          success: function () {
            Taro.showToast({
              title: '已复制小编微信到剪切板',
              icon: 'none'
            })
          }
        })
      }
    })
  }

  render () {

    const { loaded } = this.state;
    if (!loaded) {
      return <Loading />
    }
    const { userLevel, score, nickName, avatarUrl } = this.props;

    return (
      <View className='home'>
        <View className='user'>
          
          { nickName ?
            <View className='user-top'>
              <View className='user-avatar'>
                {/* 处理抖音没有open-data的问题 */}
                {
                  avatarUrl?
                  <Image style={{width:'100%',height:'100%'}} src={avatarUrl} />:<open-data type='userAvatarUrl'></open-data>
                }
              </View>
              <View className='user-name'>
                <View className='dis_flex align_item'>
                  {
                    nickName?
                    nickName:<open-data type='userNickName'></open-data>
                  }
                  <View className='user-level extra-margin-12' onClick={this.goDetail.bind(this,'user-exp-intro')}>Lv.{userLevel}</View>
                </View>
              </View>

              <View className='user-exp'  onClick={this.goDetail.bind(this,'user-exp-intro')}>
                <View className='user-exp-bar' >
                  <View className='user-exp-bar-main' style={{width:`${score[0]/score[1]*100}%`}}>
                    <View className="user-exp-bar-main-inner"></View>
                  </View>
                </View>
                <View className='user-pannel user-exp-txt'>
                  <View className='user-pannel-left font-12'>{score[0]}/{score[1]}</View>
                  <View className='user-pannel-right font-12'>升级解锁更多权益</View>
                </View>
              </View>
            </View> :
            <View className='user-gologin' onClick={this.goLogin}>注册登陆</View>
          }

          {/* <View className='user-money' onClick={this.goDetail.bind(this,'user-money')}>
            粒子：{score}&gt;
          </View>
          <View className={isSignIn?'user-signIn':'user-sign'} onClick={this.sign}>
            {isSignIn?'今日已签到':'立即签到'}
          </View> */}

          <View className='user-pannel' onClick={this.goDetail.bind(this,'user-edit')}>
            <View className='user-pannel-left'>个人信息</View>
            {/* <View className='user-pannel-right user-pannel-color-yellow'>完善资料得粒子</View> */}
          </View>

          <View className='user-pannel' onClick={this.goDetail.bind(this,'user-download')}>
            <View className='user-pannel-left'>下载中心</View>
          </View>

          <View className='user-pannel' onClick={this.goDetail.bind(this,'user-collect')}>
            <View className='user-pannel-left'>我的收藏</View>
          </View>

          <View className='user-pannel' style={{marginBottom:'10px'}}>
            {/* <View className='user-pannel-left'>邀请好友注册</View> */}
            <Button className='user-pannel-left shareBtn' openType="share">邀请好友注册</Button>
            {/* <View className='user-pannel-right user-pannel-color-gray'>邀请有礼</View> */}
          </View>

          <View className='user-pannel'  onClick={this.goDetail.bind(this,'user-protocol')}>
            <View className='user-pannel-left'>用户协议</View>
          </View>

        </View>


        <View className='user-bottom'>
          <View className='user-ad' onClick={this.copyTxt}>
            <View className='user-ad-t1'>加入小程序专属社群，收获更多…</View>
            <View className='user-ad-t2'>添加小编微信 <Text user-select={true}>autodigital-2020</Text> 立刻入群</View>
          </View>
        </View>
      </View>
    )
  }
}

export default User
