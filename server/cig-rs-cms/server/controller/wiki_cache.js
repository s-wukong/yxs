const Sequelize = require('sequelize')
const file = require('../../library/file')
const {
  uploadFileToS3,
  deleteFileFromS3,
  generatePresignedURL,
} = require('../../library/uploadFileToS3')
const cfg = require('../../config/app')
const path = require('path')
const moment = require('moment')
const env = process.env.MYSQL

const getWikiFeed = async (ctx) => {
  try {
    let rst = await ctx.sql.app_report
      .findAll({
        attributes: [
          'id',
        ],
        include: [
          {
            raw: true,
            attributes: {
              include: [
                 // 10 浏览
                 // 20 点赞
                 // 30 分享
                'content_type',
                'feed_type',
              ],
            },
            where: {
              content_type: 2,
            },
            model: ctx.sql.app_user_feed,
            as: 'report_feed',
            required: false,
          },
        ],
      })
    if (rst.length) {
      rst = rst.map(
        v => ({
          id: v.id,
          wiki_visit: v.report_feed.filter(m => m.feed_type === 10).length,
          wiki_like: v.report_feed.filter(m => m.feed_type === 20).length,
          wiki_share: v.report_feed.filter(m => m.feed_type === 30).length,
        })
      )
      file.writeFile(
        'log/wiki_feed.json',
        rst,
      )
    }

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

const getWikiCollect = async (ctx) => {
  try {
    let rst = await ctx.sql.app_report
      .findAll({
        attributes: [
          'id',
        ],
        include: [
          {
            raw: true,
            attributes: {
              include: [
                'id',
              ],
            },
            where: {
              content_type: 2,
            },
            model: ctx.sql.app_user_collect,
            as: 'report_collect',
            required: false,
          },
        ],
      })
    if (rst.length) {
      rst = rst.map(
        v => ({
          id: v.id,
          wiki_collect: v.report_collect.length,
        })
      )
      file.writeFile(
        'log/wiki_collect.json',
        rst,
      )
    }

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

const getWikiDownload = async (ctx) => {
  try {
    let rst = await ctx.sql.app_report
      .findAll({
        attributes: [
          'id',
          'title',
          'author',
          'upload_time',
          'upload_date',
          'second_tag',
          'banner_url',
          'order_key',
          'report_level',
          'is_hot',
          'link_url',
          'report_level',
        ],
        include: [
          {
            raw: true,
            attributes: {
              include: [
                'id',
              ],
            },
            model: ctx.sql.app_report_download,
            as: 'report_download',
            required: false,
          },
        ],
      })
    if (rst.length) {
      rst = rst.map(
        v => ({
          id: v.id,
          wiki_download: v.report_download.length,
        })
      )
      file.writeFile(
        'log/wiki_download.json',
        rst,
      )
    }

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
  'GET /wiki/feed_cache': getWikiFeed,
  'GET /wiki/collect_cache': getWikiCollect,
  'GET /wiki/download_cache': getWikiDownload,
}
