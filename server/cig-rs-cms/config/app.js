const env = process.env.MYSQL

let cdn = ''
let port = 8801

if (env === 'dev') {
  cdn = 'https://cigrs-cdn-dev.cigdata.cn'
} else if (env === 'qa') {
  cdn = 'https://cigrs-cdn-qa.cigdata.cn'
} else if (env === 'prod') {
  port = 8802
  cdn = 'https://cigrs-cdn.cigdata.cn'
}

module.exports = {
  port,
  cdn,
}
