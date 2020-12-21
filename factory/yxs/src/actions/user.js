import {
  USER_LOGIN,
  USER_FINDUSER,
  USER_SIGNIN,
  USER_FINDSCORE,
  USER_FINDCOLLECT,
  USER_DOWNLOADLIST,
  USER_UPDATE
} from '@constants/user'
import {
  API_USER_LOGIN,
  API_USER_FINDUSER,
  API_USER_SIGNIN,
  API_USER_FINDSCORE,
  API_USER_FINDCOLLECT,
  API_USER_DOWNLOADLIST,
  API_USER_UPDATE
} from '@constants/api'
import { createAction } from '@utils/redux'

/**
 * login
 * @param {*} payload
 */
export const dispatchLogin = payload => createAction({
  url: API_USER_LOGIN,
  type: USER_LOGIN,
  payload
})

/**
 * user
 * @param {*} payload
 */
export const dispatchGetUser = payload => createAction({
  url: API_USER_FINDUSER,
  type: USER_FINDUSER,
  payload
})

/**
 * SignIn
 * @param {*} payload
 */
export const dispatchSignIn = payload => createAction({
  url: API_USER_SIGNIN,
  type: USER_SIGNIN,
  payload
})

/**
 * sorce
 * @param {*} payload
 */
export const dispatchFindSorce = payload => createAction({
  url: API_USER_FINDSCORE,
  type: USER_FINDSCORE,
  payload
})

/**
 * collect
 * @param {*} payload
 */
export const dispatchFindCollect = payload => createAction({
  url: API_USER_FINDCOLLECT,
  type: USER_FINDCOLLECT,
  payload
})

/**
 * download
 * @param {*} payload
 */
export const dispatchFindDownload = payload => createAction({
  url: API_USER_DOWNLOADLIST,
  type: USER_DOWNLOADLIST,
  payload
})

/**
 * update
 * @param {*} payload
 */
export const dispatchUserUpdate = payload => createAction({
  url: API_USER_UPDATE,
  type: USER_UPDATE,
  payload
})