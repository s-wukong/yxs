import {
  WIKI_BANNER,
  WIKI_HOT,
  WIKI_SEARCH,
  WIKI_DETAIL,
  WIKI_SHARE
} from '@constants/database'

const INITIAL_STATE = {
  reportAmounts: "",
  uploadDate: "",
  addAmounts: 0,
  hotSearchWord: [],
  hotList: [],
  searchList: [],
  currReport:{}
}

export default function database(state = INITIAL_STATE, action) {
  switch(action.type) {
    case WIKI_BANNER: {
      // const payload = {
      //   "data": {
      //     "reportAmounts": "500+",
      //     "uploadDate": "2020-09",
      //     "addAmounts": 34,
      //     "hotSearchWord": [
      //       "汽车",
      //       "保养",
      //       "购买",
      //       "新汽发布策略"
      //     ]
      //   },
      //   "status": 200
      // };
      return {
        ...state,
        // ...payload.data,
        ...action.payload
      }
    }
    case WIKI_HOT: {
      // const payload = {
      //   "data": {
      //     "reports": [
      //       {
      //         "id": 2,
      //         "title": "2020年上半年汽车市场洞察报告",
      //         "author": "勘测者",
      //         "uploadDate": "2020-09-14"
      //       },
      //       {
      //         "id": 3,
      //         "title": "关于产品运营的方法论以及交换方案阿关于产品运营的方法论以及交换方案",
      //         "author": "CIG",
      //         "uploadDate": "2020-07-01"
      //       },
      //       {
      //         "id": 3,
      //         "title": "关于产品运营的方法论以及交换方案阿关于产品运营的方法论以及交换方案",
      //         "author": "CIG",
      //         "uploadDate": "2020-07-01"
      //       }
      //     ]
      //   },
      //   "status": 200
      // };
      return {
        ...state,
        // hotList: payload.data.reports,
        hotList: action.payload.reports
      }
    }
    case WIKI_SEARCH: {
      // const payload = {
      //   "data": {
      //     "reports": [
      //       {
      //         "id": 2,
      //         "title": "关于产品运营的方法论以及交换方案阿设计邪方案阿设计大门啦快点去看的开",
      //         "author": "新意互动出品",
      //         "uploadDate": "2020-10-11",
      //         "twoLevelTag": ['汽车','汽车信息策略','科技'],
      //         "bannerUrl": "http://",
      //         "viewCounts": 12
      //       },
      //       {
      //         "id": 3,
      //         "title": "2020年上半年汽车市场洞察报告",
      //         "author": "勘测者",
      //         "uploadDate": "2020-09-14",
      //         "secondTag": [
      //           "汽车品牌",
      //           "营销"
      //         ],
      //         "bannerUrl": "http://",
      //         "viewCounts": 789
      //       }
      //     ]
      //   },
      //   "status": 200
      // };
      return {
        ...state,
        // searchList: payload.data.reports,
        searchList: action.payload.reports
      }
    }
    case WIKI_DETAIL: {
      // const payload = {
      //   "data": {
      //     "id": 2,
      //     "title": "2020年上半年汽车市场洞察报告",
      //     "author": "勘测者",
      //     "score": 656,
      //     "linkUrl": "https://cigrs-cdn-dev.cigdata.cn/pdf/12.pdf",
      //     "isNotCollect": true
      //   },
      //   "status": 200
      // };
      return {
        ...state,
        // currReport: payload.data,
        currReport: action.payload
      }
    }
    case WIKI_SHARE: {
      return {
        ...state,
        // currReport: action.payload
      }
    }
    default:
      return state
  }
}
