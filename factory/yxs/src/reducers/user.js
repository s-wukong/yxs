import {
  USER_LOGIN,
  USER_FINDUSER,
  USER_SIGNIN,
  USER_FINDSCORE,
  USER_FINDCOLLECT,
  USER_DOWNLOADLIST,
  USER_INVIT,
  USER_UPDATE
} from '@constants/user'

const INITIAL_STATE = {
  userId: 0,
  nickName: "",
  avatarUrl: "",
  score: [0,300],
  lastSignInTime: "",
  username: "",
  company: "",
  position: "",
  phoneNumber: "",
  email: "",
  isSignIn: false,
  userLevel: 0,

  scoreList: [],
  collectList: [],
  downloadList: []
}

export default function user(state = INITIAL_STATE, action) {
  switch(action.type) {
    case USER_LOGIN: {
      // const data = {
      //   "data": {
      //     "userId": 22,
      //     "nickName": "bloom",
      //     "avatarUrl": "https://xxxxx",
      //     "score": 60,
      //     "lastSignInTime": "",
      //     "username": "",
      //     "company": "cig",
      //     "position": "",
      //     "phoneNumber": "",
      //     "email": "",
      //     "access_token": "xxxx"
      //   },
      //   "status": 200
      // };
      return {
        ...state,
        // ...data.data,
        ...action.payload
      }
    }
    case USER_FINDUSER: {
      console.log(action.payload)
      // const data = {
      //   "data": {
      //     "userId": 22,
      //     "nickName": "bloom",
      //     "avatarUrl": "https://xxxxx",
      //     "score": 60,
      //     "lastSignInTime": "",
      //     "usernam": "",
      //     "company": "cig",
      //     "position": "行政",
      //     "phoneNumber": "",
      //     "email": "",
      //     "isSignIn": false
      //   },
      //   "status": 200
      // };
      return {
        ...state,
        // ...data.data,
        ...action.payload
      }
    }
    case USER_SIGNIN: {
      // const data = {
      //   "data": {
      //     "userId": 22,
      //     "isSignIn": true,
      //     "score": 61
      //   },
      //   "status": 200
      // };
      return {
        ...state,
        ...action.payload
      }
    }
    case USER_FINDSCORE: {
      const data = {
        "data": {
          "userId": "22",
          "scoreList": [
            {
              "detailId": 2,
              "scoreDesc": "新用户注册",
              "scoreDate": "2020-09-18",
              "score": "+30"
            },
            {
              "detailId": 3,
              "scoreDesc": "每日签到",
              "scoreDate": "2020-09-18",
              "score": "+1"
            }
          ]
        },
        "status": 200
      };
      return {
        ...state,
        scoreList: action.payload.scoreList
      }
    }
    case USER_FINDCOLLECT: {
      // const data = {
      //   "data": {
      //     "reports": [
      //       {
      //         "id": 2,
      //         "title": "关于产品运营的方法论以及交换方案阿设计邪方案阿设计大门啦快点去看的开",
      //         "author": "新意互动出品",
      //         "uploadDate": "2020-10-11",
      //         "secondTag": ['汽车','汽车信息策略','科技'],
      //         "bannerUrl": "http://",
      //         "viewCounts": 12,
      //         "collectTime": "2020-09-15 18:22:33"
      //       },
      //       {
      //         "id": 3,
      //         "title": "关于产品运营的方法论以及交换方案阿设计邪方案阿设计大门啦快点去看的开",
      //         "author": "新意互动出品",
      //         "uploadDate": "2020-10-11",
      //         "secondTag": ['汽车','汽车信息策略','科技'],
      //         "bannerUrl": "http://",
      //         "viewCounts": 12,
      //         "collectTime": "2020-09-15 18:22:33"
      //       }
      //     ],
      //     "videos": [
      //       {
      //         "id": 25,
      //         "title": "主题：关于产品运营。。",
      //         "speaker": "王小美",
      //         "uploadDate": "2020-05-20",
      //         "bannerUrl": "http://",
      //         "duration": "20:41",
      //         "viewCounts": 123,
      //         "likeCounts": '12.3w',
      //         "collectTime": "2020-09-15 18:22:33"
      //       },
      //       {
      //         "id": 26,
      //         "title": "主题：关于产品运营。。",
      //         "speaker": "王小美",
      //         "uploadDate": "2020-05-20",
      //         "bannerUrl": "http://",
      //         "duration": "20:41",
      //         "viewCounts": 123,
      //         "likeCounts": '12.3w',
      //         "collectTime": "2020-09-15 18:22:33"
      //       }
      //     ]
      //   },
      //   "status": 200
      // };
      return {
        ...state,
        collectList: action.payload
      }
    }
    case USER_DOWNLOADLIST: {
      return {
        ...state,
        downloadList: action.payload
      }
    }
    case USER_INVIT: {
      return {
        ...state,
      }
    }
    case USER_UPDATE: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}
