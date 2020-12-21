import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'
import fetch, { getStorage } from '@utils/request'
import { API_USER_ADDSCORE } from '@constants/api'
import SHARE_COPYWRITING from '@constants/constant'
import SHARE_IMG from '@assets/share_img.png'
// import { getWindowHeight } from '@utils/style'

import './index.scss'

@connect(state => state.user, { ...actions })
class UserMoney extends Component {
  config = {
    navigationBarTitleText: '汽车数字化研享社'
  }

  state = {
    loaded: false,
    loading: false
  }

  componentDidMount() {
    this.props.dispatchFindSorce().then(() => {
      this.setState({ loaded: true })
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

  render () {

    const { loaded } = this.state;
    if (!loaded) {
      return <Loading />
    }

    const { score, scoreList } = this.props;

    return (
      <View className='home'>
        <View className='user-money'>

          <View className='user-money-title'>
            当前粒子
          </View>
          <View className='user-money-mo'>
            {score}
          </View>

          <View className='user-money-pannel-t'>粒子明细</View>

          {
            scoreList.length ? scoreList.map((v,i)=>(
              <View key={i} className='user-money-pannel'>
                <View className='user-money-pannel-left'>
                  <View className='user-money-pannel-left-t'>{v.scoreDesc}</View>
                  <View className='user-money-pannel-left-b'>{v.scoreDate}</View>
                </View>
                <View className='user-money-pannel-right'>{v.score}</View>
              </View>
            )) : null
          }

        </View>

      </View>
    )
  }
}

export default UserMoney
