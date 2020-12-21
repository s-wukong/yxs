const Sequelize = require('sequelize')
const sequelize = require('../../library/sequelize')

// 邀请用户表
const app_user_invitation = sequelize.define(
  'app_user_invitation',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    from_user_id: Sequelize.INTEGER,
    to_user_id: Sequelize.INTEGER,
    invitation_date: Sequelize.INTEGER,
  },
  {
    timestamps: false,
  },
)

module.exports = app_user_invitation
