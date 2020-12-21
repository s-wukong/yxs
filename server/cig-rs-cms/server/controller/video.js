const Sequelize = require('sequelize')
const {
  uploadFileToS3,
  deleteFileFromS3,
  generatePresignedURL,
} = require('../../library/uploadFileToS3')
const cfg = require('../../config/app')
const path = require('path')
const env = process.env.MYSQL

const getVideo = async (ctx) => {
  try {
    const {
      video_id,
    } = ctx.request.query
    let rst = null
    if (video_id) {
      rst = await ctx.sql.app_video
        .findOne({
          attributes: [
            'video_id',
            'banner_url',
            'speaker',
            'synopsis',
            'duration',
            'title',
            'video_link',
            'upload_time',
            'order_key',
            'is_hot',
          ],
          where: {
            video_id,
          },
        })
      if (rst.video_id) {
        // rst.banner_url = `${cfg.cdn}${rst.banner_url}`
        rst.banner_url = await generatePresignedURL(ctx, rst.banner_url, 'video-banner')
      }
    } else {
      rst = await ctx.sql.app_video
        .findAll({
          attributes: [
            'video_id',
            'banner_url',
            'speaker',
            'title',
            'video_link',
            'upload_time',
            'order_key',
            // 收藏量
          ],
          order: [
            ['video_id', 'DESC'],
          ],
          include: [
            {
              raw: true,
              attributes: {
                include: [
                  /*
                   * 10 浏览/观看/播放
                   * 20 点赞
                   * 30 分享
                  */
                  'content_type',
                  'feed_type',
                ],
              },
              where: {
                content_type: 1,
              },
              order: [
                ['id', 'DESC'],
              ],
              model: ctx.sql.app_user_feed,
              as: 'video_feed',
              required: false, // left join
            },
            {
              raw: true,
              attributes: {
                include: [
                  'id',
                ],
              },
              where: {
                content_type: 1,
              },
              model: ctx.sql.app_user_collect,
              as: 'video_collect',
              required: false, // left join
            },
            {
              raw: true,
              attributes: {
                include: [
                  'id',
                ],
              },
              model: ctx.sql.app_user_comment,
              as: 'video_comment',
              required: false, // left join
            },
          ],
        })
      rst = await Promise.all(
        rst = rst.map(
          async v => ({
            video_id: v.video_id,
            banner_url: await generatePresignedURL(ctx, v.banner_url, 'video-banner'),
            speaker: v.speaker,
            title: v.title,
            video_link: v.video_link,
            upload_time: v.upload_time,
            order_key: v.order_key,
            video_visit: v.video_feed.filter(m => m.feed_type === 10).length,
            video_like: v.video_feed.filter(m => m.feed_type === 20).length,
            video_share: v.video_feed.filter(m => m.feed_type === 30).length,
            video_collect: v.video_collect.length,
            video_comment: v.video_comment.length,
          }),
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

const deleteVideo = async (ctx) => {
  try {
    const { video_id } = ctx.request.body
    const rst = await ctx.sql.app_video
      .destroy({
        where: {
          video_id: video_id,
        },
      })
    // todo... video banner large
    deleteFileFromS3(ctx, `${video_id}.png`, 'video-banner')
    deleteFileFromS3(ctx, `${video_id}_large.png`, 'video-banner')
    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst ? '没有匹配的查询结果' : '',
      data: rst ? { video_id : video_id } : '',
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

const postVideo = async (ctx) => {
  try {
    const {
      banner_url,
      speaker,
      synopsis,
      duration,
      title,
      video_link,
      order_key,
      is_hot,
      upload_time,
    } = ctx.request.body
    let rst = ''
    let msg = ''

    rst = await ctx.sql.app_video
      .create({
        banner_url,
        speaker,
        synopsis,
        duration,
        title,
        video_link,
        upload_time,
        order_key,
        is_hot,
      })
    if (rst.video_id) {
      const filePath = `${path.join(__dirname, '../../upload')}/${banner_url}`
      const fileName = `${rst.video_id}${banner_url.match(/\.[^\.]+$/)}`
      const s3 = await uploadFileToS3(ctx, filePath, fileName, 'video-banner')
      if (s3.key) {
        const s3u = await ctx.sql.app_video
          .update(
            {
              banner_url: `/video-banner/${fileName}`,
            },
            {
              where: {
                video_id: rst.video_id,
              },
            },
          )
        if (!s3u) {
          await ctx.sql.app_video
            .destroy({
              where: {
                video_id: rst.video_id,
              },
            })
          rst = null
          msg = '添加图片到 S3 失败'
        }
      } else {
        rst = null
        msg = '文件上传到 S3 失败'
      }
    } else {
      msg = '添加失败'
    }
    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst ? '没有匹配的查询结果' : '',
      data: rst ? { video_id: rst.video_id } : '',
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


const putVideo = async (ctx) => {
  try {
    const {
      video_id,
      banner_url,
      speaker,
      synopsis,
      duration,
      title,
      video_link,
      upload_time,
      order_key,
      is_hot,
    } = ctx.request.body
    let rst = null
    let msg = ''
    let new_banner_url = ''
    if (!banner_url.startsWith('http')) {
      const filePath = `${path.join(__dirname, '../../upload')}/${banner_url}`
      const fileName = `${video_id}${banner_url.match(/\.[^\.]+$/)}`
      const s3 = await uploadFileToS3(ctx, filePath, fileName, 'video-banner')
      if (s3.key) {
        rst = true
        new_banner_url = `/video-banner/${fileName}`
      } else {
        msg = '文件上传到 S3 失败'
      }
    } else {
      rst = true
      // new_banner_url = banner_url.replace(cfg.cdn, '')
      let url = `https://cigrs.s3.cn-northwest-1.amazonaws.com.cn/${env}`
      url = banner_url.replace(url, '')
      url = url.split('?')
      new_banner_url = url[0]
    }
    if (rst) {
      rst = await ctx.sql.app_video
        .update({
          banner_url: new_banner_url,
          speaker,
          synopsis,
          duration,
          title,
          video_link,
          upload_time,
          order_key,
          is_hot,
        }, {
          where: {
            video_id,
          },
        })
    }
    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst ? '没有匹配的查询结果' : '',
      data: rst ? { video_id } : '',
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
          'id',
          'from_uname',
          'conment_content',
          'comment_time',
        ],
        where: {
          video_id: video_id,
        },
        order: [
          ['comment_time', 'DESC'],
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

const deleteCommentByID = async (ctx) => {
  try {
    const { id } = ctx.request.body
    const rst = await ctx.sql.app_user_comment
      .destroy({
        where: {
          id: id,
        },
      })
    console.log('aaa', rst)
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
  'GET /video': getVideo,
  'POST /video': postVideo,
  'PUT /video': putVideo,
  'DELETE /video': deleteVideo,
  'GET /video/comment': selectVideoCommentByVideoID,
  'DELETE /video/comment': deleteCommentByID,
}
