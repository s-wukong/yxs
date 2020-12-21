const Sequelize = require('sequelize')
const _ = require('lodash')
const file = require('../../library/file')

const selectUser = async (ctx) => {
  try {
    let rst = await ctx.sql.app_user
      .findAll({
        attributes: [
          'user_id',
          'user_name',
          'nick_name',
          'avatar_url',
          'company',
          'position',
          'phone_number',
          'email',
          'user_level',
          'registration_time',
          'last_login_time',
          'platform',
        ],
        order: [
          ['user_id', 'DESC'],
        ]
      })

    if (rst) {
      const user_score = file.readSync('log/user_score.json')
      const user_invite = file.readSync('log/user_invite.json')
      const user_collect = file.readSync('log/user_collect.json')
      const user_download = file.readSync('log/user_download.json')
      rst = rst.map(
        v => {
          const us = user_score.find(m => m.user_id === v.user_id)
          const ui = user_invite.find(m => m.user_id === v.user_id)
          const uc = user_collect.find(m => m.user_id === v.user_id)
          const ud = user_download.find(m => m.user_id === v.user_id)
          return ({
            platform: v.platform,
            user_id: v.user_id,
            user_name: v.user_name,
            nick_name: v.nick_name,
            avatar_url: v.avatar_url,
            company: v.company,
            position: v.position,
            phone_number: v.phone_number,
            email: v.email,
            user_score: us ? us.user_score : 0,
            user_level: v.user_level,
            registration_time: v.registration_time,
            last_login_time: v.last_login_time,
            invite_count: ui ? ui.invite_count : 0,
            collect_count: uc ? uc.collect_count : 0,
            download_count: ud ? ud.download_count : 0,
          })
        }
      )
    }

    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst || !rst.length ? '没有匹配的查询结果' : '',
      data: rst || [],
    }
  } catch (err) {
    ctx.logger.error(err)
    ctx.body = {
      code: 1,
      msg: 'error',
      data: [],
    }
  }
}

const selectUserScoreById = async (ctx) => {
  try {
    const { user_id } = ctx.query
    const rst = await ctx.sql.app_user_score
      .findAll({
        attributes: [
          'detail_id',
          'user_id',
          'score_type',
          'score_desc',
          'score',
          'score_time',
        ],
        where: {
          user_id,
        },
        order: [
          ['score_time', 'DESC'],
        ],
      })

    ctx.body = {
      code: rst ? 0 : 1,
      msg: rst ? '': '没有匹配的查询结果',
      data: rst || [],
    }
  } catch (err) {
    ctx.logger.error(err)
    ctx.body = {
      code: 1,
      msg: 'error',
      data: [],
    }
  }
}


const selectUserInviteById = async (ctx) => {
  try {
    const { user_id } = ctx.query
    let rst = await ctx.sql.app_user_invitation
      .findAll({
        attributes: [
          'id',
        ],
        where: {
          from_user_id: user_id,
        },
        order: [
          ['id', 'DESC'],
        ],
        include: [
          {
            attributes: [
              'user_id',
              'nick_name',
              'registration_time',
              'last_login_time',
            ],
            model: ctx.sql.app_user,
            as: 'user_invite',
            required: false,
            include: [
              {
                attributes: ['score'],
                model: ctx.sql.app_user_score,
                as: 'score',
                require: false,
              },
            ],
          },
        ],
      })
    if (rst) {
      rst = rst.map(
        v => ({
          id: v.id,
          user_id: v.user_invite.user_id,
          nick_name: v.user_invite.nick_name,
          registration_time: v.user_invite.registration_time,
          last_login_time: v.user_invite.last_login_time,
          score: _.sum(v.user_invite.score.map(m => m.score)),
        }),
      )
    }

    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst || !rst.length ? '没有匹配的查询结果' : '',
      data: rst || [],
    }
  } catch (err) {
    ctx.logger.error(err)
    ctx.body = {
      code: 1,
      msg: 'error',
      data: [],
    }
  }
}

const selectUserDownloadById = async (ctx) => {
  try {
    const { user_id } = ctx.query
    const rst = await ctx.sql.app_report_download
      .findAll({
        attributes: [
          'id',
          'report_id',
          'download_time',
          [Sequelize.col('user_download_report.title'), 'title'],
        ],
        where: {
          user_id,
        },
        order: [
          ['download_time', 'DESC'],
        ],
        include: [
          {
            attributes: [],
            model: ctx.sql.app_report,
            as: 'user_download_report',
            required: false,
          },
        ],
      })

    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst || !rst.length ? '没有匹配的查询结果' : '',
      data: rst || [],
    }
  } catch (err) {
    ctx.logger.error(err)
    ctx.body = {
      code: 1,
      msg: 'error',
      data: [],
    }
  }
}


const selectUserCollectById = async (ctx) => {
  try {
    const { user_id } = ctx.query
    const rst = await ctx.sql.app_user_collect
      .findAll({
        attributes: [
          'id',
          'collect_time',
          'content_type', // 1: 视频，2: PDF
          [Sequelize.col('user_collect_report.title'), 'report_title'],
          [Sequelize.col('user_collect_video.title'), 'video_title'],
        ],
        where: {
          user_id,
        },
        order: [
          ['collect_time', 'DESC'],
        ],
        include: [
          {
            attributes: [],
            model: ctx.sql.app_report,
            as: 'user_collect_report',
            required: false,
          },
          {
            attributes: [],
            model: ctx.sql.app_video,
            as: 'user_collect_video',
            required: false,
          },
        ],
      })

    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst || !rst.length ? '没有匹配的查询结果' : '',
      data: rst || [],
    }
  } catch (err) {
    ctx.logger.error(err)
    ctx.body = {
      code: 1,
      msg: 'error',
      data: [],
    }
  }
}


const addUserScore = async (ctx) => {
  try {
    const {
      user_id,
      score,
      score_type = 100,
      score_desc,
    } = ctx.request.body
    const rst = await ctx.sql.app_user_score
      .create({
        user_id,
        score,
        score_type,
        score_desc,
        score_time: Date.now(),
      })

    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst || !rst.length ? '没有匹配的查询结果' : '',
      data: rst || [],
    }
  } catch (err) {
    ctx.logger.error(err)
    ctx.body = {
      code: 1,
      msg: 'error',
      data: [],
    }
  }
}

module.exports = {
  'GET /user': selectUser,
  'GET /user/score': selectUserScoreById,
  'GET /user/invite': selectUserInviteById,
  'GET /user/download': selectUserDownloadById,
  'GET /user/collect': selectUserCollectById,
  'POST /user/score': addUserScore,
}
