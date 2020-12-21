// NOTE H5 端使用 devServer 实现跨域，需要修改 package.json 的运行命令，加入环境变量
const isH5 = process.env.CLIENT_ENV === 'h5'
// const HOST = '"http://172.16.250.144:9529/mock/107"'
//cdn 图片 报告资源
// const HOST = '"https://cigrs-cdn-dev.cigdata.cn"'
// const HOST = '"https://cigrs-cdn-qa.cigdata.cn"'
// const HOST = '"https://cigrs-cdn.cigdata.cn"'

// 接口地址
// const HOST = '"https://cigrs-dev.cigdata.cn"'
// const HOST = '"https://cigrs-qa.cigdata.cn"'
const HOST = '"https://cigrs.cigdata.cn"'

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    HOST: isH5 ? '"/api"' : HOST
  },
  weapp: {},
  h5: {
    devServer: {
      proxy: {
        '/api/': {
          target: JSON.parse(HOST),
          pathRewrite: {
            '^/api/': '/'
          },
          changeOrigin: true
        }
      }
    }
  }
}
