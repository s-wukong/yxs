import {
  HOME_INFO
} from '@constants/demo'

const INITIAL_STATE = {
  homeInfo: {}
}

export default function demo(state = INITIAL_STATE, action) {
  switch(action.type) {
    case HOME_INFO: {
      return {
        ...state,
        homeInfo: action.payload
      }
    }
    default:
      return state
  }
}
