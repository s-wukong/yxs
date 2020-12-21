const Sequelize = require('sequelize')
const sequelize = require('../../library/sequelize')
const app_report = require('./app_report')

// 用户报告下载表
const app_report_download = sequelize.define(
  'app_report_download',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    user_id: Sequelize.INTEGER,
    report_id: Sequelize.INTEGER,
    report_level: Sequelize.INTEGER,
    download_time: Sequelize.INTEGER,
    download_url: Sequelize.INTEGER,
  },
  {
    timestamps: false
  },
)

app_report_download.hasOne(
  app_report,
  {
    foreignKey: 'id',
    sourceKey: 'report_id',
    as: 'user_download_report',
  },
)

app_report.hasMany(
  app_report_download,
  {
    foreignKey: 'report_id',
    targetKey: 'id',
    as: 'report_download',
  },
)
module.exports = app_report_download
