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

const getWiki = async (ctx) => {
  try {
    const a = ctx.state
    console.log(a)
    const { id } = ctx.request.query
    let rst = null
    if (id) {
      rst = await ctx.sql.app_report
        .findOne({
          attributes: [
            'id',
            'title',
            'author',
            'upload_date',
            'second_tag',
            'banner_url',
            'order_key',
            'report_level',
            'is_hot',
            'link_url',
            'report_level',
          ],
          where: {
            id,
          },
        })
      if (rst.id) {
        rst.banner_url = await generatePresignedURL(ctx, rst.banner_url, 'report-banner')
      }
      if (rst.id) {
        rst.link_url = await generatePresignedURL(ctx, rst.link_url, 'pdf')
      }
    } else {
      rst = await ctx.sql.app_report
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
          order: [
            ['id', 'DESC'],
          ],
        })
      const wiki_feed = file.readSync('log/wiki_feed.json')
      const wiki_collect = file.readSync('log/wiki_collect.json')
      const wiki_download = file.readSync('log/wiki_download.json')
      rst = await Promise.all(
        rst.map(
          async v => {
            const wf = wiki_feed.find(m => m.id === v.id)
            const wc = wiki_collect.find(m => m.id === v.id)
            const wd = wiki_download.find(m => m.id === v.id)
            return ({
              id: v.id,
              banner_url: await generatePresignedURL(ctx, v.banner_url, 'report-banner'),
              author: v.author,
              title: v.title,
              upload_time: v.upload_time,
              upload_date: v.upload_date,
              second_tag: v.second_tag,
              is_hot: v.is_hot,
              order_key: v.order_key,
              report_level: v.report_level,
              wiki_visit: wf ? wf.wiki_visit : 0,
              wiki_like: wf ? wf.wiki_like : 0,
              wiki_share: wf ? wf.wiki_share : 0,
              wiki_collect: wc ? wc.wiki_collect : 0,
              wiki_download: wd ? wd.wiki_download : 0,
            })
          },
        ),
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

const deleteWiki = async (ctx) => {
  try {
    const { id } = ctx.request.body
    const rst = await ctx.sql.app_report
      .destroy({
        where: {
          id,
        },
      })
    deleteFileFromS3(ctx, `${id}.pdf`, 'pdf')
    deleteFileFromS3(ctx, `${id}_large.pdf`, 'pdf')
    deleteFileFromS3(ctx, `${id}.png`, 'report-banner')
    deleteFileFromS3(ctx, `${id}_large.png`, 'report-banner')
    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst ? '没有匹配的查询结果' : '',
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

const postWiki = async (ctx) => {
  try {
    const {
      title,
      author,
      second_tag,
      banner_url,
      order_key,
      report_level,
      is_hot,
      link_url,
    } = ctx.request.body
    let msg = ''
    let rst = await ctx.sql.app_report
      .create({
        title,
        author,
        upload_time: Date.now(),
        upload_date: moment(Date.now()).format('YYYY-MM-DD'),
        second_tag,
        banner_url,
        order_key,
        report_level,
        is_hot,
        link_url,
      })
    if (rst.id) {
      const filePath = `${path.join(__dirname, '../../upload')}/${banner_url}`
      const filePathPDF = `${path.join(__dirname, '../../upload')}/${link_url}`
      const fileName = `${rst.id}${banner_url.match(/\.[^\.]+$/)}`
      const fileNamePDF = `${rst.id}${link_url.match(/\.[^\.]+$/)}`
      const s3 = await uploadFileToS3(ctx, filePath, fileName, 'report-banner')
      const s3PDF = await uploadFileToS3(ctx, filePathPDF, fileNamePDF, 'pdf')
      if (s3 && s3PDF) {
        ctx.sql.app_report
          .update(
            {
              banner_url: `/report-banner/${fileName}`,
              link_url: `/pdf/${fileNamePDF}`,
            },
            {
              where: {
                id: rst.id,
              },
            },
          )
      } else {
        msg = '文件上传到 S3 失败'
        await ctx.sql.app_report
          .destroy({
            where: {
              id: rst.id,
            },
          })
        rst = null
      }
    }
    ctx.body = {
      code: rst ? 0 : 1,
      msg: msg,
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


const putWiki = async (ctx) => {
  try {
    const {
      id,
      video_id,
      title,
      author,
      second_tag,
      banner_url,
      order_key,
      report_level,
      is_hot,
      link_url,
    } = ctx.request.body
    let new_banner_url = ''
    let new_link_url = ''
    let rst = { id }
    let msg = ''
    if (banner_url && !banner_url.startsWith('http')) {
      const filePath = `${path.join(__dirname, '../../upload')}/${banner_url}`
      const fileName = `${id}${banner_url.match(/\.[^\.]+$/)}`
      const s3 = await uploadFileToS3(ctx, filePath, fileName, 'report-banner')
      if (s3.key) {
        new_banner_url = `/report-banner/${fileName}`
      } else {
        rst = null
        msg = '上传文件到 S3 失败'
      }
    } else if (banner_url) {
      let url = `https://cigrs.s3.cn-northwest-1.amazonaws.com.cn/${env}`
      url = banner_url.replace(url, '')
      url = url.split('?')
      new_banner_url = url[0]
    }
    if (link_url && !link_url.startsWith('http')) {
      const filePath = `${path.join(__dirname, '../../upload')}/${link_url}`
      const fileName = `${id}${link_url.match(/\.[^\.]+$/)}`
      const s3 = await uploadFileToS3(ctx, filePath, fileName, 'pdf')
      if (s3.key) {
        new_link_url = `/pdf/${fileName}`
      } else {
        rst = null
        msg = '上传文件到 S3 失败'
      }
    } else if (link_url) {
      // new_link_url = link_url.replace(cfg.cdn, '')
      let url = `https://cigrs.s3.cn-northwest-1.amazonaws.com.cn/${env}`
      url = link_url.replace(url, '')
      url = url.split('?')
      new_link_url = url[0]
    }
    if (rst) {
      const opt = {
        is_hot,
        upload_time: Date.now(),
        upload_date: moment(Date.now()).format('YYYY-MM-DD'),
      }
      if (title) opt.title = title
      if (author) opt.author = author
      if (second_tag) opt.second_tag = second_tag
      if (banner_url) opt.banner_url = new_banner_url
      // 值可以为 0
      if (typeof order_key !== 'undefined') opt.order_key = order_key
      // 值可以为 0
      if (typeof report_level !== 'undefined') opt.report_level = report_level
      if (link_url) opt.link_url =  new_link_url
      rst = await ctx.sql.app_report
        .update(
          opt,
          {
            where: {
              id,
            },
          },
        )
      if (!rst) msg = '更新失败'
    }
    ctx.body = {
      code: rst ? 0 : 1,
      msg,
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
  'GET /wiki': getWiki,
  'POST /wiki': postWiki,
  'PUT /wiki': putWiki,
  'DELETE /wiki': deleteWiki,
}
