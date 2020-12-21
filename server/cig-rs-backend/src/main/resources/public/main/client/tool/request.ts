import axios from 'axios-extra'

axios.defaults.maxConcurrent = 5

axios.defaults.headers.post['Content-Type'] = 'application/json'
const CancelToken = axios.CancelToken
const source = CancelToken.source()

export default async (
  uri,
  body,
  type = 'POST',
) => axios({
  method: type,
  url: uri,
  cancelToken: source.token,
  data: body,
})
  .then((response) => {
    if (response.status > 200) {
      return {
        code: response.status,
        msg: '网络错误',
      }
    }
    return response.data
  })
