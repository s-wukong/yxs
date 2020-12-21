const Sequelize = require('sequelize')

const getPublicity = async (ctx) => {
  try {
    const rst = await ctx.sql.app_report_publicity
      .findAll({
        attributes: [
          'id',
          'project_name',
          'report_amounts',
          'upload_time',
          'add_amounts',
          'hot_search_word',
          'is_use',
        ],
        order: [
          ['id', 'DESC'],
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

const deletePublicity = async (ctx) => {
  try {
    const { id } = ctx.request.body
    const rst = await ctx.sql.app_report_publicity
      .destroy({
        where: {
          id,
        },
      })
    ctx.body = {
      code: rst ? 0 : 1,
      msg: rst ? '' : '没有匹配的查询结果',
      data: rst ? { id } : '',
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

const postPublicity = async (ctx) => {
  try {
    const {
        project_name,
        report_amounts,
        add_amounts,
        hot_search_word,
        is_use,
    } = ctx.request.body
    const rst = await ctx.sql.app_report_publicity
      .create({
        project_name,
        report_amounts,
        upload_time: Date.now(),
        add_amounts,
        hot_search_word,
        is_use,
      })
    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst ? '没有匹配的查询结果' : '',
      data: rst ? rst : '',
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


const putPublicity = async (ctx) => {
  try {
    const {
      id,
      project_name,
      report_amounts,
      upload_time,
      add_amounts,
      hot_search_word,
      is_use,
    } = ctx.request.body
    const opt = {}
    if (typeof project_name !== 'undefined') opt.project_name = project_name
    if (typeof report_amounts !== 'undefined') opt.report_amounts = report_amounts
    if (typeof add_amounts !== 'undefined') opt.add_amounts = add_amounts
    if (typeof hot_search_word !== 'undefined') opt.hot_search_word = hot_search_word
    if (typeof is_use !== 'undefined') opt.is_use = is_use
    if (typeof upload_time !== 'undefined') opt.upload_time = upload_time
    const rst = await ctx.sql.app_report_publicity
      .update(
        opt,
          {
          where: {
            id,
          },
        },
      )
    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst ? '没有匹配的查询结果' : '',
      data: rst
        ? {
          id,
          ...opt,
        } : '',
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

const selectVideoCommentByVideoID = async (ctx) => {
  try {
    const { video_id } = ctx.query
    const rst = await ctx.sql.app_user_comment
      .findAll({
        attributes: [
          'from_uname',
          'conment_content',
          'comment_time',
        ],
        where: {
          video_id: video_id,
        },
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

const deleteCommentByID = async (ctx) => {
  try {
    const { id } = ctx.request.body
    const rst = await ctx.sql.app_user_comment
      .destroy({
        where: {
          id: id,
        },
      })
    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst ? '没有匹配的查询结果' : '',
      data: rst ? { id : id } : '',
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
  'GET /publicity': getPublicity,
  'POST /publicity': postPublicity,
  'PUT /publicity': putPublicity,
  'DELETE /publicity': deletePublicity,
}
