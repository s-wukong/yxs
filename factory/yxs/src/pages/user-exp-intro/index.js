import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'
import jump from '@utils/jump'
import fetch, { getStorage } from '@utils/request'
import { API_USER_ADDSCORE } from '@constants/api'
import SHARE_COPYWRITING from '@constants/constant'
import SHARE_IMG from '@assets/share_img.png'
// import { getWindowHeight } from '@utils/style'
import INTROBASIC from '@assets/introBasic.png'
import INTROSHARE from '@assets/introShare.png'
import INTROVIEW from '@assets/introView.png'
import INTROTOGETHER from '@assets/introTogether.png'
import GOU from './assets/gou.png'
import './index.scss'

@connect(state => state.user, { ...actions })
class UserExpIntro extends Component {
  config = {
    navigationBarTitleText: '汽车数字化研享社'
  }

  state = {
    loaded: true
  }

  componentDidMount() {
    // this.props.dispatchFindSorce().then(() => {
    //   this.setState({ loaded: true })
    // })

  }

  goDetail = (page) => {
    jump({ 
      url: `/pages/${page}/index`
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

    const { userLevel, score } = this.props;

    return (
      <View className='home'>
        <View className='user-exp-level'>
          <View className='font-12'>当前等级</View>
          <View className='user-level level_margin'>Lv.{userLevel}</View>
          <View className='user-exp'>
            <View className='user-exp-bar' >
              <View className='user-exp-bar-main' style={{width:`${score[0]/score[1]*100}%`}}>
                <View className="user-exp-bar-main-inner"></View>
              </View>
            </View>
            <View className='user-exp-txt'>
              <View className='user-exp-txt-left'>{score[0]}/{score[1]}</View>
              <View className='user-exp-txt-right' onClick={this.goDetail.bind(this,'user-exp')}>明细</View>
            </View>
          </View>
        </View>

        <View className='exp-intro-banner'>
          <View className='exp-intro-banner-card'>
            <View className='exp-intro-banner-card-content'>
              <View className='exp-intro-banner-card-content-box'>
                <View className='exp-intro-banner-card-content-box-top'>
                  <Image class='exp-intro-banner-card-content-box-top-img' src={INTROBASIC} />
                  基础值
                </View>
                <View className='exp-intro-banner-card-content-box-txt'>完善个人信息</View>
                <View className='exp-intro-banner-card-content-box-txt'>+10经验</View>
              </View>

              <View className='exp-intro-banner-card-content-box'>
                <View className='exp-intro-banner-card-content-box-top'>
                  <Image class='exp-intro-banner-card-content-box-top-img' src={INTROSHARE} />
                  分享值
                </View>
                <View className='exp-intro-banner-card-content-box-txt'>推荐好友注册</View>
                <View className='exp-intro-banner-card-content-box-txt'>+50经验</View>
              </View>

              <View className='exp-intro-banner-card-content-box'>
                <View className='exp-intro-banner-card-content-box-top'>
                  <Image class='exp-intro-banner-card-content-box-top-img' src={INTROVIEW} />
                  阅读值
                </View>
                <View className='exp-intro-banner-card-content-box-txt'>内容阅读</View>
                <View className='exp-intro-banner-card-content-box-txt'>多看多涨</View>
              </View>

              <View className='exp-intro-banner-card-content-box'>
                <View className='exp-intro-banner-card-content-box-top'>
                  <Image class='exp-intro-banner-card-content-box-top-img' src={INTROTOGETHER} />
                  共创值
                </View>
                <View className='exp-intro-banner-card-content-box-txt'>共创内容</View>
                <View className='exp-intro-banner-card-content-box-txt'>+100~1000经验</View>
              </View>
            </View>

            <View className='exp-intro-banner-card-btn'>
              <Button className='exp-intro-banner-card-btn-b' openType="share">去邀请 ></Button>
            </View>
          </View>
        </View>

        <View className='level-intro-list'>
          <View className='level-intro-list-p margin_b_32'>
            <View className='level-intro-list-title'>Lv.0 权益</View>
            {userLevel === 0 ? <View className='level-intro-list-img'><Image className='level-intro-list-img-i' src={GOU} /></View> : null}
          </View>
          <View className='level-intro-list-p'>【创想DAY】免费观看行业专家深度视频分享；</View>
          <View className='level-intro-list-p'>【WIKI智库】任意检索和阅读平台所有报告；</View>
          <View className='level-intro-list-p'>【专属社群】无门槛加入平台专属交流社群；</View>
        </View>

        <View className='level-intro-list'>
          <View className='level-intro-list-p margin_b_32'>
            <View className='level-intro-list-title'>Lv.1 权益</View>
            {userLevel === 1 ? <View className='level-intro-list-img'><Image className='level-intro-list-img-i' src={GOU} /></View> : null}
          </View>
          <View className='level-intro-list-p'>【WIKI智库】普通报告免费下载，每周2份；</View>
        </View>

        <View className='level-intro-list'>
          <View className='level-intro-list-p margin_b_32'>
            <View className='level-intro-list-title'>Lv.2 权益</View>
            {userLevel === 2 ? <View className='level-intro-list-img'><Image className='level-intro-list-img-i' src={GOU} /></View> : null}
          </View>
          <View className='level-intro-list-p'>【WIKI智库】普通报告无限免费下载；</View>
          <View className='level-intro-list-p'>【活动特权】可报名参加不定期线下行业沙龙；</View>
          <View className='level-intro-list-p'>【共创人资格】可开通内容共创人资格，参与内容推荐和创作；</View>
        </View>

        <View className='level-intro-list'>
          <View className='level-intro-list-p margin_b_32'>
            <View className='level-intro-list-title'>Lv.3 权益</View>
            {userLevel === 3 ? <View className='level-intro-list-img'><Image className='level-intro-list-img-i' src={GOU} /></View> : null}
          </View>
          <View className='level-intro-list-p'>【WIKI智库】全部报告无限免费下载；</View>
          <View className='level-intro-list-p'>【活动特权】线下行业沙龙的优先参与权及发起权；</View>
          <View className='level-intro-list-p'>【共创人权益】开启创作等级评定（深度、效果等），享受特别回馈；</View>
          <View className='level-intro-list-p'>【精选福利】研享智慧礼；</View>
        </View>

        <View className='level-intro-list'>
          <View className='level-intro-list-p'>更多权益敬请期待……</View>
        </View>
      </View>
    )
  }
}

export default UserExpIntro
