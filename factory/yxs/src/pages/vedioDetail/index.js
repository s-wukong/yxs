import Taro, { Component } from '@tarojs/taro'

import { connect } from '@tarojs/redux'
import fetch, { getStorage, goAuth, delayLoad, sendCiga } from '@utils/request'
import { saveUrl } from '@utils/jump'
import { API_VEDIO_VIEW, API_USER_ADDSCORE } from '@constants/api'
// import SPE from '@assets/spe.png'
import * as actions from '@actions/vedioDetail'
import { getWindowHeight } from '@utils/style'

import { View, Text, Image, Textarea, ScrollView, Button } from '@tarojs/components'
import { Loading } from '@components'
import LikeFX from './likeFx'
import LIKE from './assets/like.png'
import LIKEB from './assets/like-b.png'
import LOVE from './assets/love.png'
import FORWARD from './assets/forward.png'
import FAVORITES from './assets/favorites.png'
import HASFAVORITES from './assets/hasFavorites.png'
import PLAY from './assets/play-b.png'

import './index.scss'

@connect(state => state.vedioDetail, { ...actions })
class VedioDetail extends Component {
  config = {
    navigationBarTitleText: '视频详情页',
    backgroundColor: '#f6f6f6',
    usingComponents: {
      "txv-video": "plugin://tencentvideo/video"
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      word: '',
      scrollH: 200,
      isShow: true,
      loveCount: 0,
      canLove: true,
      isFoucs: false,
      inputBottomHeight:0,
      isAuth: !!getStorage('nickName')
    };
    this.videoId = parseInt(this.$router.params.videoId)
  }

  componentWillMount() {
    // 记录当前路由参数
    // saveUrl();  不让强制登陆
    
    //浏览10分钟以上得积分接口逻辑
    setTimeout(()=>{
      fetch({ 
        url: API_USER_ADDSCORE, 
        payload: {
          "scoreType": 32
        }
      });
    },1000*60*10)
  }

  componentDidMount() {
    delayLoad(6,this.initVideoData);
  }

  initVideoData = () => {
    //视频观看统计播放量
    fetch({ 
      url: API_VEDIO_VIEW, 
      payload: {
        "videoId": parseInt(this.$router.params.videoId)
      }
    });
    let data = {videoId:this.videoId};
    this.props.dispatchVedioDetail(data).then(() => {
      this.setState({ loaded: true })
    })
    this.props.dispatchVedioCommentList(data)
    sendCiga();
    Taro.uma.trackEvent('pageView', {
      dp: '视频页面/视频浏览',
      dimension1: getStorage('openId')
    });
  }

  componentDidShow(){
    this.countScrollH(1500)
  }

  countScrollH = (t) => {
    const that = this;
    setTimeout(()=>{
      const query = Taro.createSelectorQuery();
      query.selectAll('.commentScroll').boundingClientRect(function(res){
        // console.log(getWindowHeight(),res[0].top,60)
        that.setState({
          scrollH:getWindowHeight() - res[0].top - 66
        })
      }).exec()
    },t)
  }

  setWord = (e) => {
    this.setState({
      word: e.currentTarget.value.trim()
    })
  }

  handleCommentCommit = () => {
    //判断是否已授权登陆
    const { isAuth } = this.state;
    if(!isAuth){
      goAuth();
      return;
    }
    if(this.state.word){
      this.props.dispatchVedioCommentCommit({videoId:this.videoId,commentContent:this.state.word}).then(() => {
        this.setState({ 
          word:''
        })
      })
    }
  }

  handleCommentLike = () => {
    //判断是否已授权登陆
    const { isAuth } = this.state;
    if(!isAuth){
      goAuth();
      return;
    }

    this.setState({
      loveCount: this.state.loveCount + 1
    })
    if(!this.state.canLove) return;
    this.props.dispatchVedioLike({videoId:this.videoId}).then((res) => {
      sendCiga('event',{
        "eventCategory": "视频详情模块",
        "eventAction": "点赞",
        "eventLabel": "视频点赞按钮",
        "dimension1": getStorage('openId')
      });
      Taro.uma.trackEvent('event_1', {
        eventCategory: '视频详情模块',
        eventAction: '点赞',
        eventLabel: '视频点赞按钮',
        dimension1: getStorage('openId')
      });
      //点赞
      console.log(res)
      if(res) {
        this.setState({
          canLove: false
        })
        setTimeout(()=>{
          this.setState({
            canLove: true
          })
        },5000)
      }
    })
  }

  loadCommentList = () => {
    this.props.dispatchVedioCommentList({videoId:this.videoId}).then(() => {
      
    })
  }

  //滑动一定距离隐藏简介处的文字增大scroll位置的可视区域
  handleCommentScroll = (e) => {
    this.setState({
      isShow: !(e.detail.scrollTop -1 > 0)
    },()=>{
      this.countScrollH(500)
    })
  }

  handleShowAll = () => {
    // this.setState({
    //   isShow: true
    // })
  }
 
  renderCommentChild = () => {
    const { vedioCommentList } = this.props;
    
    return (
      vedioCommentList.map((obj,i)=>{
        return (
          <View key={i} className='v-d-comment-list'>
            <View className='v-d-comment-list-item'>
              <View className='v-d-comment-list-item-row'>
                <Text className='v-d-comment-list-item-row-left'>{obj.nickName}:</Text>
                
                <Text className='v-d-comment-list-item-row-right'>{obj.commentContent}</Text>
              </View>
            </View>
          </View>
        )
      })
    ) 
  }

  //收藏 取消收藏
  handleCollect = () => {
    //判断是否已授权登陆
    const { isAuth } = this.state;
    if(!isAuth){
      goAuth();
      return;
    }
    // if(this.props.vedioDetailData.isCollect) return;
    const data = {
      videoId:this.videoId,
      isCollect:!this.props.vedioDetailData.isCollect
    }
    this.props.dispatchVedioCollect(data).then((v) => {
      //判定本次操作是收藏还是取消收藏 取消收藏直接return
      // console.log(v)
      if(!v.isCollect) return;
      //收藏
      Taro.showToast({
        title: '视频收藏成功',
        icon: 'none'
      })
      sendCiga('event',{
        "eventCategory": "视频详情模块",
        "eventAction": "收藏",
        "eventLabel": "视频收藏按钮",
        "dimension1": getStorage('openId')
      });
      Taro.uma.trackEvent('event_2', {
        eventCategory: '视频详情模块',
        eventAction: '收藏',
        eventLabel: '视频收藏按钮',
        dimension1: getStorage('openId')
      });
    })

  }

  //分享
  onShareAppMessage = ( ) => {
    sendCiga('event',{
      "eventCategory": "视频详情模块",
      "eventAction": "分享",
      "eventLabel": "视频分享按钮",
      "dimension1": getStorage('openId')
    });
    Taro.uma.trackEvent('event_3', {
      eventCategory: '视频详情模块',
      eventAction: '分享',
      eventLabel: '视频分享按钮',
      dimension1: getStorage('openId')
    });
    const uid = getStorage('uid');

    this.props.dispatchVedioShare({videoId:this.videoId})
    return {
      title: this.props.vedioDetailData.title,
      path: `/pages/vedioDetail/index?from=sharebutton&sourceUserId=${uid}&videoId=${this.videoId}`
    }
  }

  goLogin = () => {
    goAuth();
  }

  //处理微信官方键盘弹起输入框被遮挡的bug - 不设置adjustPosition={false}则键盘弹起会挤压视频定位的元素，影响效果
  handleInputFocus = (event) => {
    let keybordH = event.detail.height;
    //设置输入区域高度
    let inputBottomHeight = keybordH ;
  
    this.setState({
      isFoucs: true,
      inputBottomHeight: (inputBottomHeight-10) +'px'
    })
  }
  handleInputBlur = () => {
    this.setState({
      isFoucs: false,
      inputBottomHeight: 0
    })
  }

  render () {
    if (!this.state.loaded) {
      return <Loading />
    }

    const { word, scrollH, isShow, loveCount, canLove, inputBottomHeight,isFoucs, isAuth } = this.state;
    const { vedioDetailData } = this.props;

    return (
      <View className='home'>
        {/* 视频 */}
        {process.env.TARO_ENV === 'h5'?
          <iframe frameBorder="0" width='100%' src="https://v.qq.com/txp/iframe/player.html?vid=z3115k474mr" allowFullScreen="true"></iframe>
          :
            <View className="video-container">
              <View className='video-container-box'></View>
              <View className='video-container-content'>
                <txv-video 
                  vid={vedioDetailData.videoLink}
                  playerid="txv1" 
                  width="100%"
                  height="100%"
                  // usePoster={true}
                  poster={vedioDetailData.bannerUrl}
                  autoplay="{{false}}"> 
                  <view class='txv-video-slot'>video slot</view>
                </txv-video> 
              </View>
            </View>
        }

        {/* 视频标题 */}
      <View className="v-d-title1">{vedioDetailData.title}</View>

        {
          isShow?
            <View className='v-d-title2 bottom-line show-animate'>
              <View className='v-d-title2-content'>
                <Image mode='aspectFit' src={PLAY} className='v-d-title2-content-img'></Image>
                <Text>{vedioDetailData.viewCounts}</Text>
              </View>
              <View className='v-d-title2-content'>
                <Image mode='aspectFit' src={LIKEB} className='v-d-title2-content-img'></Image>
                <Text>{vedioDetailData.likeCounts}</Text>
              </View>
              <View className='v-d-title2-content margin_left_8'>
                <Text>{vedioDetailData.uploadDate}</Text>
              </View>
            </View>:null
        }

        {/* 视频简介 */}
        <View className='v-d-intro'>
          {
            isShow?
              <View className='show-animate'>
                <View className='v-d-intro-title'>
                  分享人：{vedioDetailData.speaker}
                </View>

                <View className='v-d-intro-content'>
                  简介：{vedioDetailData.synopsis}
                </View>
              </View>:null
          }

          <View className='v-d-intro-ad'>
            请添加小编微信 autodigital-2020,备注“研享社用户”一键进群
          </View>
          <View className='v-d-intro-bot'>
            <View className='v-d-intro-bot-btn'>
              {
                isAuth ? <Button className='v-d-intro-bot-btn-b' openType="share" hoverClass="button-hover">
                  <Image mode='aspectFit' src={FORWARD} className='v-d-intro-bot-btn-img'></Image>
                  <Text>分享</Text>
                </Button> :
                <Button className='v-d-intro-bot-btn-b' onClick={this.goLogin} hoverClass="button-hover">
                  <Image mode='aspectFit' src={FORWARD} className='v-d-intro-bot-btn-img'></Image>
                  <Text>分享</Text>
                </Button>
              }
            </View>
            
            <View className='v-d-intro-bot-btn' onClick={this.handleCollect}>
              <Button className='v-d-intro-bot-btn-b' hoverClass="button-hover">
                <Image mode='aspectFit' src={vedioDetailData.isCollect?HASFAVORITES:FAVORITES} className='v-d-intro-bot-btn-img'></Image>
                <Text>收藏</Text>
              </Button>
            </View>
          </View>
        </View>

        {/* 评论列表 */}
        <ScrollView
          scrollY
          className='commentScroll'
          ref={(e)=>this.commentDom = e}
          onScrollToLower={this.loadCommentList}
          onScroll={this.handleCommentScroll}
          onScrollToUpper={this.handleShowAll}
          style={{ height: (scrollH + 'px') }}
        >
          {this.renderCommentChild()}
          
        </ScrollView>

        {/* 底部评论区 */}
        <View className='v-d-intro-b' style={{height:isFoucs?'72rpx':'110rpx'}}>
          <View className='v-d-intro-b-container'>
            <Textarea 
              onInput={this.setWord} 
              className='v-d-intro-b-container-txt' 
              value={word} 
              adjustPosition={false}
              showConfirmBar={false}
              // onConfirm={this.handleCommentCommit} 
              style={{bottom: inputBottomHeight, width:isFoucs?'80%':'68%'}}
              onFocus={this.handleInputFocus}
              onBlur={this.handleInputBlur}
              placeholder='写评论'
              placeholderClass='v-d-intro-b-container-txt-place'
              />
            <View className='v-d-intro-b-container-btn' style={{bottom: inputBottomHeight}} onClick={this.handleCommentCommit}>完成</View>
            <Image className='v-d-intro-b-container-img' onClick={this.handleCommentLike} src={canLove?LOVE:LIKE}></Image>

            <LikeFX count={loveCount} />
          </View>
        </View>

      </View>
    )
  }
}

export default VedioDetail
