import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/database'
import jump from '@utils/jump'
import { getStorage, delayLoad, sendCiga } from '@utils/request'
import { API_USER_ADDSCORE } from '@constants/api'
import { getWindowHeight } from '@utils/style'
import SHARE_IMG from '@assets/share_img.png'
import SHARE_COPYWRITING from '@constants/constant'
import SEARCHIMG from './assets/search-img.png'
import FIRE from './assets/fire.png'
import './index.scss'

@connect(state => state.database, { ...actions })
class Database extends Component {
  config = {
    navigationBarTitleText: '汽车数字化研享社'
  }

  state = {
    loaded: false
  }

  //componentDidMount
  componentDidShow() {

    delayLoad(6,this.initPdfData);

  }

  initPdfData = () => {
    this.props.dispatchWikiBanner().then(() => {
      this.setState({ loaded: true })
    });
    this.props.dispatchWikiHot();
    sendCiga('pv',{
      dp: '报告页面/报告首页',
      dimension1: getStorage('openId')
    });
    Taro.uma.trackEvent('pageView', {
      dp: '报告页面/报告首页',
      dimension1: getStorage('openId')
    });
  }

  goDatabaseSearch = (e, v) => {
    let params = {};
    if(e !== '-1') params = { payload: {searchLabel: e}}

    jump({ 
      url: '/pages/database-search/index',
      ...params
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

  reportList = () => {

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

    const { reportAmounts, uploadDate, addAmounts, hotSearchWord, hotList } = this.props

    return (
      <View className='home'>
        <View className='report-main'>
          <View className='report-main-banner'>
            <Text className='report-main-banner-t1'>{reportAmounts}</Text>
            <Text className='report-main-banner-t2'>{uploadDate} 增加{addAmounts}份</Text>
          </View>
          <Image className='report-main-search' src={SEARCHIMG} onClick={this.goDatabaseSearch.bind(this,'-1')}/>
          
          <ScrollView
            scrollY
            className='databaseScroll'
            ref={(e)=>this.reportDom = e}
            onScrollToLower={this.reportList}
            style={{ height: ((getWindowHeight()-179) + 'px') }}
          >
            <View className='report-main-label'>
              {
                hotSearchWord.length ? hotSearchWord.map((v, i) => (
                  <View key={i} className='report-main-label-btn' onClick={this.goDatabaseSearch.bind(this,v)}>{v}</View>
                )) : null
              }
            </View>

            <View className='report-main-hot-list'>
              <View className='report-main-hot-list-t1'>
                <Image src={FIRE} className='report-main-hot-list-t1-img'/> 热门报告
              </View>

              {
                hotList.length ? hotList.map(v => (
                  <View key={v.id} className='report-main-hot-list-c' onClick={this.goReportDetail.bind(this,v)}>
                    <View className='report-main-hot-list-c-p1'>
                    {v.title}
                    </View>
                    <View className='report-main-hot-list-c-p2'>
                    {v.author}  {v.uploadDate}
                    </View>
                  </View>
                )) : null
              }

            </View>
            
          </ScrollView>

        </View>

      </View>
    )
  }
}

export default Database
