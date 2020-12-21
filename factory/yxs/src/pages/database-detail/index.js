import Taro, { Component } from '@tarojs/taro'
import { WebView } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/database'
import fetch, { getStorage, delayLoad, sendCiga } from '@utils/request'
import jump,{ saveUrl } from '@utils/jump'
import { PDFJS, API_USER_ADDSCORE, API_WIKI_VIEW } from '@constants/api'
import './index.scss'

@connect(state => state.database, { ...actions })
class ReportDetail extends Component {
  config = {
    navigationBarTitleText: '汽车数字化研享社'
  }

  constructor(props) {
    this.state = {
      loaded: false,
      reportUrlWithParams:''
    }
    this.reportId = this.$router.params.reportId
    this.userId = this.$router.params.userId
    this.reportTitle = this.$router.params.reportTitle
    this.reportUrl = this.$router.params.reportUrl 
  }

  componentDidMount() {
    //记录当前路由参数
    saveUrl(); // 不让强制登陆 为了在webview登陆完之后能重定向到webview以保证更新页面
    const that = this;
    let uid=getStorage('uid');
    let token=getStorage('token');

    //未登陆  不让强制登陆
    // if(!(uid && token)){
    //   jump({
    //     url: '/pages/user-login/index'
    //   })
    // }

    //浏览量统计
    fetch({ 
      url: API_WIKI_VIEW, 
      payload: {
        "reportId": this.$router.params.reportId
      }
    });
    //浏览1分钟以上得积分接口逻辑
    setTimeout(()=>{
      fetch({ 
        url: API_USER_ADDSCORE, 
        payload: {
          "scoreType": 31
        }
      });
    },1000*60)
    let isAuth = !!getStorage('nickName')?1:0;
    this.setState({
      loaded: true,
      reportUrlWithParams: `${that.reportUrl}?uid=${uid}&token=${token}&reportId=${that.reportId}&isAuth=${isAuth}`
    })
  }

  componentDidShow() {
    sendCiga();
    Taro.uma.trackEvent('pageView', {
      dp: '报告页面/报告浏览',
      dimension1: getStorage('openId')
    });
    //转为后台判断邀请新用户加积分逻辑
    // if(this.$router.params.from === wikiShare) this.props.dispatchWIKIShareGetUser({source: this.userId})
  }

  onShareAppMessage( ) {
    // console.log(options.webViewUrl)
    
    sendCiga('event',{
      "eventCategory": "报告详情页分享",
      "eventAction": "分享",
      "eventLabel": "view",
      "dimension1": getStorage('openId')
    });
    Taro.uma.trackEvent('event_4', {
      "eventCategory": "报告详情页分享",
      "eventAction": "分享",
      "eventLabel": "view",
      "dimension1": getStorage('openId')
    });

    this.props.dispatchWikiShare({reportId: this.reportId})

    return {
      title: this.reportTitle,
      path: `/pages/database-detail/index?from=wikiShare&reportId=${this.reportId}&sourceUserId=${this.userId}&reportUrl=${this.reportUrl}&reportTitle=${this.reportTitle}`
    }
  }

  render () {

    const { loaded, reportUrlWithParams } = this.state;
    if (!loaded) {
      return <Loading />
    }

    // const { currReport } = this.props;

    return (
      <WebView src={`${PDFJS}?file=${reportUrlWithParams}`}></WebView>
    )
  }
}

export default ReportDetail
