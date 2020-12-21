const env = require('./env')

const port = 7777
const api = {
  mock: 'http://172.16.250.144:9529/mock/101',
  local: 'http://127.0.0.1:9521',
  dev: 'http://172.16.250.144:9521',
  qa: 'http://172.16.8.150:9521',
  prod: 'https://jdy.cigdata.cn',
}

module.exports = {
  port,
  api: api[env],
}
