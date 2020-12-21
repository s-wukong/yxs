import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'
import jump from '@utils/jump'
import fetch, { getStorage } from '@utils/request'
import { API_USER_ADDSCORE } from '@constants/api'
import SHARE_COPYWRITING from '@constants/constant'
import SHARE_IMG from '@assets/share_img.png'
import { getWindowHeight } from '@utils/style'
import SEE from '@assets/see.png'
// import CAR from '@assets/car.png'
import './index.scss'

@connect(state => state.user, { ...actions })
class UserCollect extends Component {
  config = {
    navigationBarTitleText: '汽车数字化研享社',
    // navigationBarBackgroundColor: '#FCB900'
  }

  state = {
    loaded: false
  }

  componentDidMount() {
    this.props.dispatchFindDownload().then(() => {
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
        reportTitle: v.title,
        reportUrl: v.linkUrl //'https://cigrs-cdn-dev.cigdata.cn/pdf/12.pdf'
      }
    })
  }

  //渲染已下载报告列表
  renderReportChild = () => {
    const { downloadList } = this.props;
    return downloadList.reports.length?downloadList.reports.map((obj,ind)=>(
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
    )):<View className={'no-collect'}>暂无下载～</View>
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

    // const { tab } = this.state;

    return (
      <View className='home'>

        <ScrollView
          scrollY
          className='home-wrap'
          style={{ height: (getWindowHeight() - 60)+ 'px' }}
        >

          <View className='vedio-container'>
            {this.renderReportChild()}
          </View>
        </ScrollView>

      </View>
    )
  }
}

export default UserCollect
