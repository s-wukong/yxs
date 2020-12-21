import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Image, ScrollView } from '@tarojs/components'
import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/database'
import fetch, { getStorage } from '@utils/request'
import { API_USER_ADDSCORE } from '@constants/api'
import jump from '@utils/jump'
import { getWindowHeight } from '@utils/style'
import SHARE_COPYWRITING from '@constants/constant'
import SEE from '@assets/see.png'
// import CAR from '@assets/car.png'
import SHARE_IMG from '@assets/share_img.png'
import './index.scss'

@connect(state => state.database, { ...actions })
class DatabaseSearch extends Component {
  config = {
    navigationBarTitleText: '汽车数字化研享社',
    // navigationBarBackgroundColor: '#FCB900'
  }

  state = {
    loaded: true,
    searchLabel: '',
    // searchList: []
  }

  componentDidMount() {
    // Taro.showToast({
    //   title: '提示信息',
    //   icon: 'none',
    //   duration: 6000
    // })
    let searchLabel = this.$router.params.searchLabel;

    //处理抖音传值自动转码的兼容问题
    if(process.env.TARO_ENV === 'tt') searchLabel = decodeURIComponent(searchLabel)
    
    if(searchLabel){
      // console.log(searchLabel)
      this.setState({
        searchLabel: searchLabel
      })
      this.handleSearch({currentTarget:{value:searchLabel}});
    }

  }

  handleSearch = (e) => {
    console.log(e.currentTarget.value)
    if(!e.currentTarget.value) return;
    this.props.dispatchWikiSearch({
      "searchWord": e.currentTarget.value
    }).then((res) => {
        // console.log(res,'res')
        // this.setState({
        //   searchList : [
        //     {
        //       "id": 2,
        //       "title": "关于产品运营的方法论以及交换方案阿设计邪方案阿设计大门啦快点去看的开",
        //       "author": "新意互动出品",
        //       "uploadDate": "2020-10-11",
        //       "twoLevelTag": ['汽车','汽车信息策略','科技'],
        //       "bannerUrl": "http://",
        //       "viewCounts": 12
        //     },
        //     {
        //       "id": 3,
        //       "title": "2020年上半年汽车市场洞察报告",
        //       "author": "勘测者",
        //       "uploadDate": "2020-09-14",
        //       "secondTag": [
        //         "汽车品牌",
        //         "营销"
        //       ],
        //       "bannerUrl": "http://",
        //       "viewCounts": 789
        //     }
        //   ]
        // })

        //搜索结果为空时toast提示
        if(res.reports.length) return;
        Taro.showToast({
          title: '暂无相关报告',
          icon: 'none',
          duration: 1500
        })
    });
  }

  goReportDetail = (v) => {
    const userId = getStorage('uid');
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

  //渲染报告列表
  renderReportChild = () => {
    const { searchList } = this.props;
    return searchList.length?searchList.map((obj,ind)=>(
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
    )):null
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

    const { searchLabel } =this.state;

    return (
      <View className='home'>

        <View className='database-search'>
          <Input onConfirm={this.handleSearch} value={searchLabel} placeholder='Search' placeholderStyle='color:#000' type='text' />
        </View>

        {/* { searchLabel?<View className='database-search-label-btn'>{searchLabel}</View>:null} */}

        <ScrollView
          scrollY
          className='home-wrap'
          style={{ height: (getWindowHeight() - 60)+ 'px' }}
        >

          <View className='database-container'>
            {this.renderReportChild()}
          </View>
        </ScrollView>

      </View>
    )
  }
}

export default DatabaseSearch
