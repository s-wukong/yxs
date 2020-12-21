import {
  VEDIO_DETAIL,
  VEDIO_COMMENT_LIST,
  VEDIO_COMMENT_COMMIT,
  VEDIO_GIVE_LIKE,
  VEDIO_COLLECT,
  VEDIO_SHARE
} from '@constants/vedioDetail'

const INITIAL_STATE = {
  vedioDetailData: {},
  vedioCommentList: []
}

export default function vedioDetail(state = INITIAL_STATE, action) {
  switch(action.type) {
    case VEDIO_DETAIL: {
      // const payloadData = {
      //   "data": {
      //     "id": 25,
      //     "title": "关于产品运营的方法论以及交换方案关于产品运营的方法论以及交换方案",
      //     "speaker": "王小美",
      //     "uploadDate": "2020-05-20",
      //     "bannerUrl": "http://",
      //     "videoLink": "https://",
      //     "duration": "20:41",
      //     "viewCounts": 123,
      //     "likeCounts": '12.3w',
      //     "synopsis": "数据分析是指用适当的统计分析方法对收集来的大量数据进行分析，将。。。。。。。。",
      //     "isCollect": false
      //   },
      //   "status": 200
      // };
      return {
        ...state,
        // vedioDetailData: payloadData.data,
        vedioDetailData: action.payload
      }
    }
    case VEDIO_COMMENT_LIST: {
      // console.log(action.payload)

      // const payloadData = {
      //   "data": {
      //     "comments": [
      //       {
      //         "userId": 1,
      //         "nickName": "小明",
      //         "commentContent": "数据分析是指用适当的统计去以宏观的角度预测事物的发展方向"
      //       },
      //       {
      //         "userId": 2,
      //         "nickName": "小明",
      //         "commentContent": "老师讲的太好了"
      //       },
      //       {
      //         "userId": 3,
      //         "nickName": "小明",
      //         "commentContent": "666"
      //       },
      //       {
      //         "userId": 4,
      //         "nickName": "小明",
      //         "commentContent": "棒棒的！"
      //       }
      //     ]
      //   },
      //   "status": 200
      // };
      return {
        ...state,
        // vedioCommentList: payloadData.data.comments
        vedioCommentList: action.payload.comments
      }
    }
    case VEDIO_COMMENT_COMMIT: {
      // const commentRes = {
      //   "data": {
      //     "userId": "2",
      //     "videoId": "22",
      //     "nickName": "小明",
      //     "commentContent": "这是一个评论、这是一个评论"
      //   },
      //   "status": 200
      // }
      // console.log(action.payload)
      return {
        ...state,
        // vedioCommentList: state.vedioCommentList.concat([commentRes.data])
        vedioCommentList: [action.payload].concat(state.vedioCommentList)
      }
    }
    case VEDIO_GIVE_LIKE: {
      return {
        ...state,
      }
    }
    case VEDIO_COLLECT: {
      // console.log(action.payload)
      // const collectData = {
      //   "data": {
      //     "userId": "2",
      //     "videoId": "22",
      //     "isCollect": true
      //   },
      //   "status": 200
      // };
      return {
        ...state,
        vedioDetailData: {
          ...state.vedioDetailData,
          "isCollect": action.payload.isCollect
        }
      }
    }
    case VEDIO_SHARE: {
      return {
        ...state,
      }
    }
    default:
      return state
  }
}
