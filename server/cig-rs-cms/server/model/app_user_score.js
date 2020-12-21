const Sequelize = require('sequelize')
const sequelize = require('../../library/sequelize')

// 用户积分表
const app_user_score = sequelize.define(
  'app_user_score',
  {
    detail_id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    user_id: Sequelize.INTEGER,
    score_type: Sequelize.INTEGER,
    score_desc: Sequelize.STRING(255),
    score: Sequelize.INTEGER,
    score_time: Sequelize.INTEGER,
  },
  {
    timestamps: false,
  },
)

module.exports = app_user_score
