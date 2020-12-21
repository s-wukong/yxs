const Sequelize = require('sequelize')
const _ = require('lodash')
const file = require('../../library/file')

const selectUserScore = async (ctx) => {
  try {
    let rst = await ctx.sql.app_user
      .findAll({
        attributes: [
          'user_id',
        ],
        include: [
          {
            attributes: {
              exclude: [
                'detail_id',
                'score_type',
                'score_desc',
                'score_time',
              ],
              include: [
                'user_id',
                'score',
              ],
            },
            model: ctx.sql.app_user_score,
            as: 'score',
            required: false,
          },
        ],
      })

    if (rst) {
      rst = rst.map(
        v => ({
          user_id: v.user_id,
          user_score: _.sum(v.score.map(m => m.score)),
        }),
      )
      file.writeFile(
        'log/user_score.json',
        rst,
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

const selectUserInvite = async (ctx) => {
  try {
    let rst = await ctx.sql.app_user
      .findAll({
        attributes: [
          'user_id',
        ],
        include: [
          {
            raw: true,
            attributes: {
              exclude: [
                'from_user_id',
                'to_user_id',
                'invitation_date',
              ],
              include: [
                'id',
              ],
            },
            model: ctx.sql.app_user_invitation,
            as: 'invite',
            required: false,
          },
        ],
      })

    if (rst) {
      rst = rst.map(
        v => ({
          user_id: v.user_id,
          invite_count: v.invite.length,
        }),
      )
      file.writeFile(
        'log/user_invite.json',
        rst,
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

const selectUserDownload = async (ctx) => {
  try {
    let rst = await ctx.sql.app_user
      .findAll({
        attributes: [
          'user_id',
        ],
        include: [
          {
            attributes: {
              exclude: [
                'user_id',
                'report_id',
                'download_time',
                'download_url',
              ],
              include: [
                'id',
              ],
            },
            model: ctx.sql.app_report_download,
            as: 'download',
          },
        ],
      })

    if (rst) {
      rst = rst.map(
        v => ({
          user_id: v.user_id,
          download_count: v.download.length,
        }),
      )
      file.writeFile(
        'log/user_download.json',
        rst,
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

const selectUserCollect = async (ctx) => {
  try {
    let rst = await ctx.sql.app_user
      .findAll({
        attributes: [
          'user_id',
        ],
        include: [
          {
            attributes: {
              exclude: [
                'user_id',
                'content_id',
                'content_type',
                'collect_time',
              ],
              include: [
                'id',
              ],
            },
            model: ctx.sql.app_user_collect,
            as: 'collect',
            required: false,
          },
        ],
      })

    if (rst) {
      rst = rst.map(
        v => ({
          user_id: v.user_id,
          collect_count: v.collect.length,
        }),
      )
      file.writeFile(
        'log/user_collect.json',
        rst,
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


module.exports = {
  'GET /user/score_cache': selectUserScore,
  'GET /user/invite_cache': selectUserInvite,
  'GET /user/download_cache': selectUserDownload,
  'GET /user/collect_cache': selectUserCollect,
}
