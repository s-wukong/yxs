const Sequelize = require('sequelize')
const sequelize = require('../../library/sequelize')

// 用户评论表
module.exports = sequelize.define(
  'app_user_comment',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    video_id: Sequelize.INTEGER,
    conment_content: Sequelize.STRING(255),
    from_uid: Sequelize.INTEGER,
    from_uname: Sequelize.STRING(100),
    to_uid: Sequelize.INTEGER,
    to_uname: Sequelize.STRING(100),
    comment_time: Sequelize.INTEGER,
  },
  {
    timestamps: false,
  },
)
