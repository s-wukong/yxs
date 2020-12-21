import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
// import { Loading } from '@components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'
// import { getWindowHeight } from '@utils/style'
import fetch, { getStorage } from '@utils/request'
import { API_USER_ADDSCORE } from '@constants/api'
import SHARE_COPYWRITING from '@constants/constant'
import SHARE_IMG from '@assets/share_img.png'
import EDIT from './assets/edit.png'
import './index.scss'

@connect(state => state.user, { ...actions })
class UserEdit extends Component {
  config = {
    navigationBarTitleText: '汽车数字化研享社'
  }

  state = {
    edit: true,
    editData: {}
  }

  componentDidMount() {
    // Taro.showToast({
    //   title: '提示信息',
    //   icon: 'none',
    //   duration: 6000
    // })
    // console.log(this.props,'user')
    const { username, company, position, phoneNumber, email } = this.props;
    this.setState({
      editData:{
        username, company, position, phoneNumber, email
      }
    })
  }

  handleCommit = (v, e) => {
    // console.log(v, e.currentTarget.value, 'handleCommit')
    this.setState({
      editData: {
        ...this.state.editData,
        [v]: e.currentTarget.value
      }
    })
  }

  goCommit = () => {
    const { editData } = this.state;
    this.props.dispatchUserUpdate(editData).then(()=>{
      Taro.showToast({
        title: '修改成功',
        icon: 'none'
      })
    });
  }

  goBack = () => {
    Taro.navigateBack({
      delta: 1
    })
  }

  handleEdit = () => {
    this.setState({
      edit: !this.state.edit
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
    const { nickName, avatarUrl } = this.props;
    const { username, company, position, phoneNumber, email } = this.state.editData;
    const { edit } = this.state;
    return (
      <View className='home'>
        <View className='user'>
          <View className='user-info-top'>
            <View className='user-avatar'>
              {/* 处理抖音没有open-data的问题 */}
              {
                avatarUrl?
                <Image style={{width:'100%',height:'100%'}} src={avatarUrl} />:<open-data type='userAvatarUrl'></open-data>
              }
            </View>
            <View className='user-name'>
              {
                nickName?
                nickName:<open-data type='userNickName'></open-data>
              }
            </View>
          </View>

          <View className='user-edit'>
            <View className='user-edit-left'>
              <Text className='user-edit-left-txt'>姓名：</Text>
              {edit?
                <Input className='user-edit-left-input' value={username} type='text' placeholder='输入姓名' onInput={this.handleCommit.bind(this,'username')}/>:
                <Text className='user-edit-left-txt'>{username}</Text>  
              }
            </View>
            {/* <View className='user-edit-right user-edit-color-yellow' onClick={this.handleEdit}>
              <Image class='edit-img' src={EDIT} ></Image>
            </View> */}
          </View>

          <View className='user-edit'>
            <View className='user-edit-left'>
              <Text className='user-edit-left-txt'>公司：</Text>
              {edit?
                <Input className='user-edit-left-input' type='text' value={company} placeholder='请输入公司' onInput={this.handleCommit.bind(this,'company')}/>:
                <Text className='user-edit-left-txt'>{company}</Text>  
              }
            </View>
            {/* <View className='user-edit-right user-edit-color-yellow'>粒子+10</View> */}
          </View>

          <View className='user-edit'>
            <View className='user-edit-left'>
              <Text className='user-edit-left-txt'>职务：</Text>
              {edit?
                <Input className='user-edit-left-input' type='text' value={position} placeholder='您所在公司的职务' onInput={this.handleCommit.bind(this,'position')}/>:
                <Text className='user-edit-left-txt'>{position}</Text>  
              }
            </View>
            {/* <View className='user-edit-right user-edit-color-yellow'>粒子+10</View> */}
          </View>

          <View className='user-edit'>
            <View className='user-edit-left'>
              <Text className='user-edit-left-txt'>手机：</Text>
              {edit?
              <Input className='user-edit-left-input' maxLength={11} type='number' value={phoneNumber} placeholder='请输入手机号码' onInput={this.handleCommit.bind(this,'phoneNumber')}/>
              :<Text className='user-edit-left-txt'>{phoneNumber}</Text>  
              }
            </View>
            {/* <View className='user-edit-right user-edit-color-yellow'>粒子+10</View> */}
          </View>

          <View className='user-edit'>
            <View className='user-edit-left'>
              <Text className='user-edit-left-txt'>邮箱：</Text>
              {edit?
              <Input className='user-edit-left-input' type='text' value={email} placeholder='请输入您的邮箱' onInput={this.handleCommit.bind(this,'email')}/>
              :<Text className='user-edit-left-txt'>{email}</Text>  
              }
            </View>
            {/* <View className='user-edit-right user-edit-color-yellow'>粒子+10</View> */}
          </View>

        </View>

        {
          edit ? 
          <View className='user-edit-bot'>
            <View className='user-edit-bot-l' onClick={this.goBack}>取消</View>
            <View className='user-edit-bot-r' onClick={this.goCommit}>确认</View>
          </View> :
          <View className='user-edit-bot'>
            <View className='user-edit-bot-r' onClick={this.handleEdit}>编辑</View>
          </View>
        }

      </View>
    )
  }
}

export default UserEdit
