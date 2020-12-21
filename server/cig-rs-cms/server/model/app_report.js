const Sequelize = require('sequelize')
const sequelize = require('../../library/sequelize')
const app_user_feed = require('./app_user_feed')
const app_user_collect = require('./app_user_collect')

// 报告信息表
const app_report = sequelize.define(
  'app_report',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    title: Sequelize.STRING(100),
    author: Sequelize.STRING(100),
    upload_time: Sequelize.INTEGER,
    upload_date: Sequelize.STRING(255),
    second_tag: Sequelize.STRING(255),
    banner_url: Sequelize.STRING(255),
    order_key: Sequelize.INTEGER,
    score: Sequelize.INTEGER,
    is_hot: Sequelize.INTEGER,
    link_url: Sequelize.STRING(255),
    report_level: Sequelize.INTEGER,
  },
  {
    timestamps: false
  },
)

app_report.hasMany(
  app_user_feed,
  {
    foreignKey: 'content_id',
    targetKey: 'id',
    as: 'report_feed',
  },
)

app_report.hasMany(
  app_user_collect,
  {
    foreignKey: 'content_id',
    targetKey: 'id',
    as: 'report_collect',
  },
)

app_user_collect.hasOne(
  app_report,
  {
    foreignKey: 'id',
    sourceKey: 'content_id',
    as: 'user_collect_report',
  },
)

module.exports = app_report
