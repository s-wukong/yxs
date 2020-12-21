const isH5 = process.env.CLIENT_ENV === 'h5'

// const HOST = '"https://cigrs-dev.cigdata.cn"'
// const HOST = '"https://cigrs-qa.cigdata.cn"'
const HOST = '"https://cigrs.cigdata.cn"'

// const HOST_H5 = '"https://cigrs-dev.cigdata.cn"'
const HOST_H5 = '"https://cigrs.cigdata.cn"'

module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    HOST: isH5 ? HOST_H5 : HOST
  },
  weapp: {},
  h5: {
    publicPath: '/yxs'
  }
}
