const schedule = require('node-schedule')
const axios = require('axios-extra')
const { port } = require('../config/app')
const uri = `http://0.0.0.0:${port}/api`

const wiki_feed = () => axios.get(`${uri}/wiki/feed_cache`)
const wiki_collect = () => axios.get(`${uri}/wiki/collect_cache`)
const wiki_download = () => axios.get(`${uri}/wiki/download_cache`)

const user_score = () => axios.get(`${uri}/user/score_cache`)
const user_invite = () => axios.get(`${uri}/user/invite_cache`)
const user_collect = () => axios.get(`${uri}/user/collect_cache`)
const user_download = () => axios.get(`${uri}/user/download_cache`)

module.exports = async () => {
  user_score()
  user_invite()
  user_collect()
  user_download()

  wiki_feed()
  wiki_collect()
  wiki_download()


  // 秒 分 时 日 月 周
  schedule.scheduleJob('* 0 * * * *', () => wiki_feed())
  schedule.scheduleJob('* 5 * * * *', () => wiki_collect())
  schedule.scheduleJob('* 10 * * * *', () => wiki_download())

  schedule.scheduleJob('* 30 * * * *', () => user_score())
  schedule.scheduleJob('* 35 * * * *', () => user_invite())
  schedule.scheduleJob('* 40 * * * *', () => user_collect())
  schedule.scheduleJob('* 45 * * * *', () => user_download())
}
