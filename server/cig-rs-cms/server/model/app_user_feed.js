const Sequelize = require('sequelize')
const sequelize = require('../../library/sequelize')

// 用户反馈表
module.exports = sequelize.define(
  'app_user_feed',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    user_id: Sequelize.INTEGER,
    content_id: Sequelize.INTEGER,
    content_type: Sequelize.INTEGER,
    feed_type: Sequelize.INTEGER,
    feed_time: Sequelize.INTEGER,
  },
  {
    timestamps: false,
  },
)
