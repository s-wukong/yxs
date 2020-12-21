import {
  VEDIO_LIST
} from '@constants/inx'
import {
  API_VEDIO_LIST
} from '@constants/api'
import { createAction } from '@utils/redux'

/**
 * 首页数据
 * @param {*} payload
 */
export const dispatchVedioList = payload => createAction({
  url: API_VEDIO_LIST,
  type: VEDIO_LIST,
  method: 'POST',
  payload
})
