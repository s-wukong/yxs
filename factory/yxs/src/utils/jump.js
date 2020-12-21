import Taro from '@tarojs/taro'

const PAGE_WEBVIEW = '/pages/database-detail/index'

/**
 * // NOTE 后端返回的 url 可能是网页链接，需要在 webview 中打开
 * 也可能是小程序自身的链接，只能用 navigate/redirect 之类的打开
 * 就需要有个地方统一判断处理
 */
export default function jump(options) {
  const { url, title = '', payload = {}, method = 'navigateTo', reload = ()=>{} } = options

  if (/^https?:\/\//.test(url)) {
    Taro[method]({
      url: urlStringify(PAGE_WEBVIEW, { url, title })
    })
  } else if (/^\/pages\//.test(url)) {
    // TODO H5 不支持 switchTab，暂时 hack 下
    if (process.env.TARO_ENV === 'h5' && method === 'switchTab') {
      Taro.navigateBack({ delta: Taro.getCurrentPages().length - 1 })
      setTimeout(() => { Taro.redirectTo({ url }) }, 100)
      return
    }

    Taro[method]({
      url: urlStringify(url, payload),
      success: () => {
        reload();
      }
    })
  }
}

function urlStringify(url, payload, encode = true) {
  const arr = Object.keys(payload).map(key =>
    `${key}=${encode ? encodeURIComponent(payload[key]) : payload[key]}`
  )

  // NOTE 注意支付宝小程序跳转链接如果没有参数，就不要带上 ?，否则可能无法跳转
  return arr.length ? `${url}?${arr.join('&')}` : url
}

export const saveUrl = () => {
  let pages = Taro.getCurrentPages()
  let currentPage = pages[pages.length - 1] //获取当前页面的对象
  let url = currentPage.route //当前页面url
  let options = currentPage.options //如果要获取url中所带的参数可以查看options
  // console.log(url,options,'saveUrl')
  return Promise.all([
    Taro.setStorage({ key: 'Url', data: `/${url}` }),
    Taro.setStorage({ key: 'UrlOptions', data: options })
  ])
  // Taro.setStorageSync({ key: 'Url', data: url })
}

export const clearUrl = () => {
  return Promise.all([
    Taro.setStorage({ key: 'Url', data: '' }),
    Taro.setStorage({ key: 'UrlOptions', data: {}})
  ])
}