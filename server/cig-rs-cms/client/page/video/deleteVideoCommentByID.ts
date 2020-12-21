import r from 'tool/request'

// 删除视频评论
export default async (opt) => {
  const rst = await r(
    '/api/video/comment',
    opt,
    'DELETE',
  )

  if (rst.status > 200) {
    return rst.msg || '网络错误'
  }

  return rst.data
}
