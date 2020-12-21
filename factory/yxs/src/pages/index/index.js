import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/inx'
import fetch, { getStorage, delayLoad, sendCiga } from '@utils/request'
import { API_USER_ADDSCORE } from '@constants/api'
import jump,{ saveUrl } from '@utils/jump'
import { getWindowHeight } from '@utils/style'
// import searchIcon from './assets/search.png'
import SHARE_COPYWRITING from '@constants/constant'
// import SPE from '@assets/spe.png'
import SHARE_IMG from '@assets/share_img.png'
import LIKE from './assets/like.png'
import PLAY from './assets/play.png'
import './index.scss'

@connect(state => state.inx, { ...actions })
class Index extends Component {
  config = {
    navigationBarTitleText: '汽车数字化研享社',
    // navigationBarBackgroundColor: '#FCB900'
  }

  state = {
    loaded: false,
    // loading: false,
    // lastItemId: 0,
    // hasMore: true
  }

  componentDidMount(){
    //先禁止访问视频模块 自动跳转到WIKI
    jump({ 
      url: '/pages/database/index',
      method: 'switchTab'
    })
  }

  componentDidShow() {
    // 记录当前路由参数
    // saveUrl();  不让强制登陆

    delayLoad(6,this.initIndexData);

  }

  initIndexData = () => {
    this.props.dispatchVedioList().then(() => {
      this.setState({ loaded: true })
    })
    sendCiga();
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

  //渲染模版时方法名以render开头
  renderVedioChild = () => {
    const { vedioList } = this.props;
    return vedioList.length?vedioList.map((obj,ind)=>
      (<View className='vedio-list' key={ind} onClick={this.goVedioDetail.bind(this,obj)}>
        <View className='vedio-list-img'>
          <Image
            className={'vedio-spec'}
            mode='aspectFit'
            src={obj.bannerUrl}
          />
          {/* obj.bannerUrl */}
          <Text className={'vedio-list-img-txt'}>{obj.duration}</Text>
        </View>
      <View className='vedio-list-title'>{obj.title}</View>
        <View className='vedio-list-des'>
          <View className='vedio-list-des-label-left'>
            <View className='vedio-list-des-label-left-txt'>分享人：{obj.speaker}</View>{obj.uploadDate}
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
    ):<View className={'no-collect'}>暂无视频～</View>
  }

  render () {
    if (!this.state.loaded) {
      return <Loading />
    }

    // const { vedioList } = this.props

    return (
      <View className='home'>
        {/* <View className='home-search'>
          <View className='home-search-wrap'>
            <Image className='home-search-img' src={searchIcon} />
            <Input className='home-search-input' type='text' placeholder='Search' placeholderStyle='color:#gray'/>
          </View>
        </View> */}

        <ScrollView
          scrollY
          className='home-wrap'
          style={{ height: getWindowHeight() + 'px' }}
        >

          <View className='vedio-container'>
            {this.renderVedioChild()}
          </View>
        </ScrollView>

      </View>
    )
  }
}

export default Index
