import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Image, ScrollView } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'
import jump from '@utils/jump'
import { getWindowHeight } from '@utils/style'
import fetch, { getStorage } from '@utils/request'
import { API_USER_ADDSCORE } from '@constants/api'
import SHARE_COPYWRITING from '@constants/constant'
import SHARE_IMG from '@assets/share_img.png'
import SEE from '@assets/see.png'
// import CAR from '@assets/car.png'
// import SPE from '@assets/spe.png'
import LIKE from './assets/like.png'
import PLAY from './assets/play.png'
import database from './assets/database.png'
import databaseActive from './assets/database-active.png'
import home from './assets/home.png'
import homeActive from './assets/home-active.png'
import './index.scss'

@connect(state => state.user, { ...actions })
class UserCollect extends Component {
  config = {
    navigationBarTitleText: '汽车数字化研享社',
    // navigationBarBackgroundColor: '#FCB900'
  }

  state = {
    loaded: false,
    tab:0
  }

  componentDidMount() {
    this.props.dispatchFindCollect().then(() => {
      this.setState({ loaded: true })
      //没有收藏内容时提示
        // Taro.showToast({
        //   title: '暂无收藏',
        //   icon: 'none',
        //   duration: 1500
        // })
    })
  }

  goReportDetail = (v) => {
    const userId = getStorage('uid');
    // console.log(v,'reprotss')
    jump({ 
      url: '/pages/database-detail/index',
      payload: {
        reportId: v.id,
        userId: userId,
        // isAuth: !!getStorage('nickName')?1:0,
        reportTitle: v.title,
        reportUrl: v.linkUrl //'https://cigrs-cdn-dev.cigdata.cn/pdf/12.pdf'
      }
    })
  }

  goVedioDetail = (v) =>{
    // console.log(v,'shouye')
    jump({ 
      url: '/pages/vedioDetail/index',
      payload: {
        videoId: v.id
      }
    })
  }

  //切换tab
  changeTab = (v) => {
    // console.log(v)
    const { tab } =this.state;
    if(tab === v) return;
    this.setState({
      tab:v
    })
  }

  //渲染报告列表
  renderReportChild = () => {
    const { collectList } = this.props;
    return collectList.reports.length?collectList.reports.map((obj,ind)=>(
      <View className='report-list' key={ind} onClick={this.goReportDetail.bind(this,obj)}>
          <View className='report-list-content'>
            <View className='report-list-content-left'>
              <View className='report-list-content-left-t1'>
                {obj.title}
              </View>
              <View className='report-list-content-left-t2'>
                <Text className='report-list-content-left-t2-txt margin_right_0'>{obj.author}</Text>
                <View className='report-list-content-left-t2-txt float_right margin_right_0'>
                  <Image className='report-list-content-left-t2-img' src={SEE}/>
                  {obj.viewCounts}
                </View>
                <Text className='report-list-content-left-t2-txt float_right'>{obj.uploadDate}</Text>
              </View>
            </View>
            <View className='report-list-content-right'>
              <Image className='report-list-content-right-img' src={obj.bannerUrl}/>
            </View>
          </View>
          <View className='report-list-label'>
              {obj.secondTag.map((v,i) =>(
                <View key={i} className='report-list-label-btn'>{v}</View>
              ))}
          </View>
      </View>
    )):<View className={'no-collect'}>暂无收藏～</View>
  }

  //渲染视频列表
  renderVedioChild = () => {
    const { collectList } = this.props;
    // console.log(collectList)
    return collectList.videos.length?collectList.videos.map(obj=>
      (<View className='vedio-list' key={obj.id} onClick={this.goVedioDetail.bind(this,obj)}>
        <View className='vedio-list-img'>
          <Image
            className={'vedio-spec'}
            mode='aspectFit'
            src={obj.bannerUrl}
          />
          <Text className={'vedio-list-img-txt'}>{obj.duration}</Text>
        </View>
        <View className='vedio-list-title'>{obj.title}</View>
        <View className='vedio-list-des'>
          <View className='vedio-list-des-label-left'>
            <View className='vedio-list-des-label-left-txt'>主讲人：{obj.speaker}</View>    
            {obj.uploadDate}
          </View>

          <View className='vedio-list-des-label-right'>
            <Image className='like-img' mode='aspectFit' src={LIKE}/>
            <Text>{obj.likeCounts}</Text>
          </View>
          <View className='vedio-list-des-label-right'>
            <Image className='like-img' mode='aspectFit' src={PLAY}/>
            <Text>{obj.viewCounts}</Text>
          </View>
        </View>
      </View>)
    ):<View className={'no-collect'}>暂无收藏～</View>
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
    if (!this.state.loaded) {
      return <Loading />
    }

    const { tab } = this.state;

    return (
      <View className='home'>

        <ScrollView
          scrollY
          className='home-wrap'
          style={{ height: (getWindowHeight() - 60)+ 'px' }}
        >

          <View className='vedio-container'>
            {tab?this.renderVedioChild():this.renderReportChild()}
          </View>
        </ScrollView>

        <View className='user-collect-bot'>
          <View className='user-collect-bot-left' onClick={this.changeTab.bind(this,0)}>
            <Image className='user-collect-bot-left-img' src={tab?database:databaseActive}/>
            <View className='user-collect-bot-left-txt'>智库</View>
          </View>
          <View className='user-collect-bot-right' onClick={this.changeTab.bind(this,1)}>
            <Image className='user-collect-bot-right-img' src={tab?homeActive:home}/>
            <View className='user-collect-bot-right-txt'>视频</View>
          </View>
        </View>

      </View>
    )
  }
}

export default UserCollect
