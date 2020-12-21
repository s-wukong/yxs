import axios from 'axios-extra'
import {
  add,
  remove,
} from './loading'

axios.defaults.maxConcurrent = 5

axios.defaults.headers.post['Content-Type'] = 'application/json'
const CancelToken = axios.CancelToken
const source = CancelToken.source()

export default async (
  uri,
  body,
  type = 'POST',
) => {
  remove()
  if (type !== 'GET') add()
  let u = uri
  if (type === 'GET' && Object.keys(body).length) {
    u = `${uri}?`
    Object.keys(body).map(
      (key) => {
        u += `${key}=${body[key]}&`
        return null
      },
    )
    u = u.substring(0, u.length - 1)
  }

  return axios({
    method: type,
    url: u,
    cancelToken: source.token,
    data: body,
  })
    .then((response) => {
      let rst = response.data
      if (response.status > 200) {
        rst = {
          code: response.status,
          msg: '网络错误',
        }
      } else if (response?.data?.code === 2) {
        window.location.href = '/login'
        rst = {
          code: response.status,
          msg: response?.data?.msg || '用户未登录',
        }
      }
      remove()
      return rst
    })
}
