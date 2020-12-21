import {
  WIKI_BANNER,
  WIKI_HOT,
  WIKI_SEARCH,
  WIKI_DETAIL,
  WIKI_SHARE
} from '@constants/database'
import {
  API_WIKI_BANNER,
  API_WIKI_HOT,
  API_WIKI_SEARCH,
  API_WIKI_DETAIL,
  API_WIKI_SHARE
} from '@constants/api'
import { createAction } from '@utils/redux'

/**
 * WikiBanner
 * @param {*} payload
 */
export const dispatchWikiBanner = payload => createAction({
  url: API_WIKI_BANNER,
  type: WIKI_BANNER,
  payload
})

/**
 * WikiHot
 * @param {*} payload
 */
export const dispatchWikiHot = payload => createAction({
  url: API_WIKI_HOT,
  type: WIKI_HOT,
  payload
})

/**
 * WikiSearch
 * @param {*} payload
 */
export const dispatchWikiSearch = payload => createAction({
  url: API_WIKI_SEARCH,
  type: WIKI_SEARCH,
  payload
})

/**
 * WikiDetail
 * @param {*} payload
 */
export const dispatchWikiDetail = payload => createAction({
  url: API_WIKI_DETAIL,
  type: WIKI_DETAIL,
  payload
})

/**
 * WikiDetail
 * @param {*} payload
 */
export const dispatchWikiShare = payload => createAction({
  url: API_WIKI_SHARE,
  type: WIKI_SHARE,
  payload
})