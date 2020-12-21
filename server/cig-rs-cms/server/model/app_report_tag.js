const Sequelize = require('sequelize')
const sequelize = require('../../library/sequelize')

// 报告信息表
const app_report_tag = sequelize.define(
  'app_report_tag',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    first_tag_id: Sequelize.INTEGER,
    first_tag_name: Sequelize.STRING(255),
    second_tag_id: Sequelize.INTEGER,
    second_tag_name: Sequelize.STRING(255),
  },
  {
    timestamps: false
  },
)

module.exports = app_report_tag
