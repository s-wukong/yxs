import {
  VEDIO_DETAIL,
  VEDIO_COMMENT_LIST,
  VEDIO_COMMENT_COMMIT,
  VEDIO_GIVE_LIKE,
  VEDIO_COLLECT,
  VEDIO_SHARE
} from '@constants/vedioDetail'
import {
  API_VEDIO_DETAIL,
  API_VEDIO_COMMENT_LIST,
  API_VEDIO_COMMENT_COMMIT,
  API_VEDIO_GIVE_LIKE,
  API_VEDIO_COLLECT,
  API_VEDIO_SHARE
} from '@constants/api'
import { createAction } from '@utils/redux'

/**
 * vedio数据
 * @param {*} payload
 */
export const dispatchVedioDetail = payload => createAction({
  url: API_VEDIO_DETAIL,
  type: VEDIO_DETAIL,
  payload
})

/**
 * 评论列表
 * @param {*} payload
 */
export const dispatchVedioCommentList = payload => createAction({
  url: API_VEDIO_COMMENT_LIST,
  type: VEDIO_COMMENT_LIST,
  payload
})

/**
 * 提交评论
 * @param {*} payload
 */
export const dispatchVedioCommentCommit = payload => createAction({
  url: API_VEDIO_COMMENT_COMMIT,
  type: VEDIO_COMMENT_COMMIT,
  payload
})

/**
 * 点赞视频
 * @param {*} payload
 */
export const dispatchVedioLike = payload => createAction({
  url: API_VEDIO_GIVE_LIKE,
  type: VEDIO_GIVE_LIKE,
  payload
})

/**
 * 收藏视频
 * @param {*} payload
 */
export const dispatchVedioCollect = payload => createAction({
  url: API_VEDIO_COLLECT,
  type: VEDIO_COLLECT,
  payload
})

/**
 * 分享视频
 * @param {*} payload
 */
export const dispatchVedioShare = payload => createAction({
  url: API_VEDIO_SHARE,
  type: VEDIO_SHARE,
  payload
})