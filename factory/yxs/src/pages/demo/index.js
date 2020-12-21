import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/demo'
import { getWindowHeight } from '@utils/style'
import Banner from './banner'
// import searchIcon from './assets/search.png'
import './index.scss'

@connect(state => state.demo, { ...actions })
class Demo extends Component {
  config = {
    navigationBarTitleText: 'taro-super',
    usingComponents: {
      "txv-video": "plugin://tencentvideo/video"
    }
  }

  state = {
    loaded: false,
    loading: false,
    lastItemId: 0,
    hasMore: true
  }

  componentDidMount() {
    // Taro.showToast({
    //   title: '提示信息',
    //   icon: 'none',
    //   duration: 6000
    // })

    this.props.dispatchHome().then(() => {
      console.log(this.props)
      this.setState({ loaded: true })
    })
    // this.props.dispatchSearchCount()
    // this.props.dispatchPin({ orderType: 4, size: 12 })
    // this.loadRecommend()
  }

  loadRecommend = () => {
    return
    if (!this.state.hasMore || this.state.loading) {
      return
    }

    const payload = {
      lastItemId: this.state.lastItemId,
      size: 20
    }
    this.setState({ loading: true })
    this.props.dispatchRecommend(payload).then((res) => {
      const lastItem = res.rcmdItemList[res.rcmdItemList.length - 1]
      this.setState({
        loading: false,
        hasMore: res.hasMore,
        lastItemId: lastItem && lastItem.id
      })
    }).catch(() => {
      this.setState({ loading: false })
    })
  }

  handlePrevent = () => {
    Taro.showToast({
      title: '目前只可点击底部推荐商品',
      icon: 'none'
    })
  }

  render () {
    if (!this.state.loaded) {
      return <Loading />
    }

    const { homeInfo } = this.props

    return (
      <View className='home'>
        <ScrollView
          scrollY
          className='home__wrap'
          onScrollToLower={this.loadRecommend}
          style={{ height: getWindowHeight() }}
        >
          <View onClick={this.handlePrevent}>
            <Banner list={homeInfo.focus} />
          </View>
          
        </ScrollView>

        {process.env.TARO_ENV === 'h5'?
          <iframe frameBorder="0" src="https://v.qq.com/txp/iframe/player.html?vid=z3115k474mr" allowFullScreen="true"></iframe>
          :
            <txv-video 
            vid="z3115k474mr"
            playerid="txv1" 
            width="100%"
            autoplay="{{false}}"> 
            <view class='txv-video-slot'>video slot</view>
          </txv-video>  
        }
      </View>
    )
  }
}

export default Demo
