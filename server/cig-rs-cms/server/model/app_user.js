const Sequelize = require('sequelize')
const sequelize = require('../../library/sequelize')
const app_user_score = require('./app_user_score')
const app_user_invitation = require('./app_user_invitation')
const app_user_collect = require('./app_user_collect')
const app_report_download = require('./app_report_download')

// 用户表
const app_user = sequelize.define(
  'app_user',
  {
    user_id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    open_id: Sequelize.STRING(255),
    union_id: Sequelize.STRING(255),
    user_name: Sequelize.STRING(100),
    nick_name: Sequelize.STRING(100),
    avatar_url: Sequelize.STRING(255),
    company: Sequelize.STRING(255),
    position: Sequelize.STRING(255),
    phone_number: Sequelize.STRING(255),
    email: Sequelize.STRING(255),
    user_level: Sequelize.INTEGER,
    registration_time: Sequelize.INTEGER,
    last_login_time:  Sequelize.INTEGER,
    platform: Sequelize.STRING(11),
  },
  {
    timestamps: false
  },
)

app_user.hasMany(
  app_user_score,
  {
    foreignKey: 'user_id',
    targetKey: 'user_id',
    as: 'score',
  },
)

app_user.hasMany(
  app_user_invitation,
  {
    foreignKey: 'from_user_id',
    targetKey: 'user_id',
    as: 'invite',
  },
)

app_user.hasMany(
  app_user_collect,
  {
    foreignKey: 'user_id',
    targetKey: 'user_id',
    as: 'collect',
  },
)

app_user.hasMany(
  app_report_download,
  {
    foreignKey: 'user_id',
    targetKey: 'user_id',
    as: 'download',
  },
)

app_user_invitation.hasOne(
  app_user,
  {
    foreignKey: 'user_id',
    sourceKey: 'to_user_id',
    as: 'user_invite',
  },
)

app_report_download.hasOne(
  app_user,
  {
    foreignKey: 'user_id',
    sourceKey: 'user_id',
    as: 'user_download',
  },
)

app_user_collect.hasOne(
  app_user,
  {
    foreignKey: 'user_id',
    sourceKey: 'user_id',
    as: 'user_collect',
  },
)

module.exports = app_user
