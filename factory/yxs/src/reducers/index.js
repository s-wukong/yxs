import { combineReducers } from 'redux'
import inx from './inx'
import vedioDetail from './vedioDetail'
import database from './database'
import user from './user'

export default combineReducers({
  inx,
  vedioDetail,
  database,
  user
})
