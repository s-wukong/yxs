import {
  VEDIO_LIST
} from '@constants/inx'

const INITIAL_STATE = {
  vedioList: {}
}

export default function inx(state = INITIAL_STATE, action) {
  switch(action.type) {
    case VEDIO_LIST: {
      // console.log(action.payload,'action.payload')
      // let vedioData = Array.from({length:10}).map((v,i)=>{
      //   return {
      //     "id": 25,
      //     "title": "主题：关于产品运营。。",
      //     "speaker": "王小美",
      //     "uploadDate": "2020-05-20",
      //     "bannerUrl": "http://",
      //     "duration": "20:41",
      //     "viewCounts": '123',
      //     "likeCounts": '12.3w'
      //   }
      // })
      return {
        ...state,
        // vedioList: vedioData
        vedioList: action.payload.videos
      }
    }
    default:
      return state
  }
}
