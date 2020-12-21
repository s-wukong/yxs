import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'
import fetch, { getStorage } from '@utils/request'
import { API_USER_ADDSCORE } from '@constants/api'
import SHARE_COPYWRITING from '@constants/constant'
import SHARE_IMG from '@assets/share_img.png'
// import { getWindowHeight } from '@utils/style'

import './index.scss'

@connect(state => state.user, { ...actions })
class UserProtocol extends Component {
  config = {
    navigationBarTitleText: '小程序用户协议',
    // navigationBarBackgroundColor: '#FCB900'
  }

  state = {

  }

  componentDidMount() {

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

    return (
      <View className='home'>

        <View className="user-protocol-list">
          <View className='user-protocol-list-p'>
          欢迎来到“汽车数字化研享社”小程序！
          </View>
          <View className='user-protocol-list-p'>
          “汽车数字化研享社”小程序，旨在为汽车领域内的从业人员、研究者、市场营销、学习爱好者等提供快速、全面、便捷的专业信息服务及功能，不依靠小程序内发布的公开性内容获利，除非增强或强化目前服务的任何新功能或专属内容，将作另行规定。
          </View>
          <View className='user-protocol-list-p'>
          在使用“汽车数字化研享社”小程序前，请仔细阅读以下所有条款。当您注册或登录“汽车数字化研享社”小程序，或使用小程序内的任何功能，即表明您（即：用户）完全接受本协议项下的全部条款，您应遵守本协议和相关法律的规定。
          </View>
          <View className='user-protocol-list-p'>
          使用规则及免责条款
          </View>
          <View className='user-protocol-list-p'>
          1.用户注册成功后，应对在“汽车数字化研享社”小程序的注册信息的真实性、合法性、有效性承担全部责任，用户不得冒充他人。否则“汽车数字化研享社”有权立即停止提供服务，收回其帐号并由用户独自承担由此而产生的一切后果。
          </View>
          <View className='user-protocol-list-p'>
          2.用户下载“汽车数字化研享社”小程序内的公开报告时，该报告的知识产权仍属于原作者所有，用户仅可以自行使用，不得做商业用途或在公开渠道传播，否则带来的相关后果由用户自行承担。
          </View>
          <View className='user-protocol-list-p'>
          3.用户在“汽车数字化研享社”小程序对文档、文字、图片、图表、数据等内容下载或使用时，需明确了解作者对于文件内容的版权声明与用途限制，并严格遵守使用规范。“汽车数字化研享社”不对用户下载后用途负责，由用户使用产生任何纠纷与“汽车数字化研享社”无关。
          </View>
          <View className='user-protocol-list-p'>
          4.“汽车数字化研享社”小程序仅作为信息分享平台，不拥有内容版权，也不为其版权，以及内容的合法性、准确性、安全性和品质等问题负责，不构成任何建议。用户因使用“汽车数字化研享社”小程序下载资源而引致的任何意外、疏忽、合约毁坏、诽谤、版权或知识产权侵犯及其所造成的损失，“汽车数字化研享社”不承担任何法律责任。
          </View>
          <View className='user-protocol-list-p'>
          使用限制
          </View>
          <View className='user-protocol-list-p'>
          “汽车数字化研享社”小程序记录和分析用户在该小程序内的各类使用行为，如发现用户出现恶意传播、盗用下载、恶意抓取、非法手段获取用户权限等威胁“汽车数字化研享社”平台和作者权益的行为时，“汽车数字化研享社”有权取消其用户权限，包括但不限于禁止其下载报告或文档，停止其账号使用权限，中止已经下载的报告或文档或会员的功能和权限。
          </View>
          <View className='user-protocol-list-p'>
          知识产权
          </View>
          <View className='user-protocol-list-p'>
          “汽车数字化研享社”小程序是一个专业信息分享平台，尊重和保护每一份报告的知识产权，所有报告文档的知识产权均属于原作者或出品方所有，所有文档版本均为可对外发布的免费版（公开版/试用版/推广版/简要版）等，均属于作者意图公开/推广/发布。如公开文档有涉嫌侵权（包括侵犯著作权、商业秘密或个人隐私等情形），欢迎用户向“汽车数字化研享社”进行投诉，“汽车数字化研享社”将视情况予以删除或修订处理。
          </View>
          <View className='user-protocol-list-p'>
          用户等级与提升途径
          </View>
          <View className='user-protocol-list-p'>
          用户等级设置
          </View>
          <View className='user-protocol-list-p'>
          “汽车数字化研享社”小程序目前设有LV.0、LV.1、LV.2、LV.3四个用户等级，每个等级享有不同的用户权益（具体参见用户权益展示）。
          </View>
          <View className='user-protocol-list-p'>
          用户等级提升途径
          </View>
          <View className='user-protocol-list-p'>
          当用户授权登录“汽车数字化研享社”小程序后，即成为LV.0等级用户，之后可通过以下几种途径提升用户等级。
          </View>
          <View className='user-protocol-list-p'>
          1.基础值：包含登陆、完善用户基本信息（姓名、手机号、公司、职务、邮箱）；
          </View>
          <View className='user-protocol-list-p'>
          2.分享值；包含邀请好友注册和分享小程序的内容；
          </View>
          <View className='user-protocol-list-p'>
          3.阅读值：包含用户在小程序内的内容阅读量、下载量、点赞、收藏等使用行为；
          </View>
          <View className='user-protocol-list-p'>
          4.共创值：包含优质内容推荐和原创内容创作；
          </View>
          <View className='user-protocol-list-p'>
          网站反馈
          </View>
          <View className='user-protocol-list-p'>
          商业合作，企业咨询，解决方案，研究服务与案例推荐等商业问题，请直接和原作者或报告出品方联系（报告结尾所附联系方式）。“汽车数字化研享社”小程序仅为信息分享平台，不提供相关商业服务。
          </View>
          <View className='user-protocol-list-p'>
          用户关于版权、投诉、平台使用等方面出现的问题，可发邮件进行反馈。
          </View>
          <View className='user-protocol-list-p'>
          联系邮箱：cig-clzx@cig.com.cn（请简单描述问题，附用户名）
          </View>

        </View>
      </View>
    )
  }
}

export default UserProtocol
