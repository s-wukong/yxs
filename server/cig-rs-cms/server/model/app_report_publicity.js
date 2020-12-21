const Sequelize = require('sequelize')
const sequelize = require('../../library/sequelize')

// 报告宣传表
const app_report_publicity = sequelize.define(
  'app_report_publicity',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    project_name: Sequelize.STRING(255),
    report_amounts: Sequelize.STRING(255),
    upload_time: Sequelize.INTEGER,
    add_amounts: Sequelize.INTEGER,
    hot_search_word: Sequelize.STRING(255),
    is_use: Sequelize.INTEGER,
  },
  {
    timestamps: false
  },
)

module.exports = app_report_publicity
