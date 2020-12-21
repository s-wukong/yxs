const Sequelize = require('sequelize')
const sequelize = require('../../library/sequelize')
const app_report = require('./app_report')

// 用户收藏表
const app_user_collect = sequelize.define(
  'app_user_collect',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    user_id: Sequelize.INTEGER,
    content_id: Sequelize.INTEGER,
    content_type:  Sequelize.INTEGER,
    collect_time:  Sequelize.INTEGER,
  },
  {
    timestamps: false,
  },
)

module.exports = app_user_collect
