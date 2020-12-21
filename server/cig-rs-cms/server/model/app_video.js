const Sequelize = require('sequelize')
const sequelize = require('../../library/sequelize')
const app_user_feed = require('./app_user_feed')
const app_user_collect = require('./app_user_collect')
const app_user_comment = require('./app_user_comment')

// 视频信息表
const app_video = sequelize.define(
  'app_video',
  {
    video_id: {
      primaryKey: true,
      autoIncrement: true,
      type: Sequelize.INTEGER,
    },
    banner_url: Sequelize.STRING(255),
    speaker: Sequelize.STRING(255),
    synopsis: Sequelize.STRING(255),
    duration: Sequelize.STRING(255),
    title: Sequelize.STRING(255),
    video_link: Sequelize.STRING(255),
    upload_time: Sequelize.INTEGER,
    order_key: Sequelize.INTEGER,
    is_hot: Sequelize.INTEGER,
  },
  {
    timestamps: false,
  },
)

app_video.hasMany(
  app_user_feed,
  {
    foreignKey: 'content_id',
    targetKey: 'id',
    as: 'video_feed',
  },
)

app_video.hasMany(
  app_user_collect,
  {
    foreignKey: 'content_id',
    targetKey: 'id',
    as: 'video_collect',
  },
)

app_video.hasMany(
  app_user_comment,
  {
    foreignKey: 'video_id',
    targetKey: 'id',
    as: 'video_comment',
  },
)

app_user_collect.hasOne(
  app_video,
  {
    foreignKey: 'video_id',
    sourceKey: 'content_id',
    as: 'user_collect_video',
  },
)

module.exports = app_video
