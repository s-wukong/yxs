const Sequelize = require('sequelize')
const { uploadFileToS3 } = require('../../library/uploadFileToS3')
const path = require('path')
const env = process.env.MYSQL

const getReportTag = async (ctx) => {
  try {
    const rst = await ctx.sql.app_report_tag
      .findAll({
        attributes: [
          'id',
          'first_tag_id',
          'first_tag_name',
          'second_tag_id',
          'second_tag_name',
        ],
        order: [
          ['id', 'ASC'],
        ],
      })

    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst ? '没有匹配的查询结果' : '',
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
  'GET /tag': getReportTag,
}
