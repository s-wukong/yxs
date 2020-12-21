import r from 'tool/request'

// 查询视频评论
export default async (opt) => {
  const rst = await r(
    '/api/video/comment',
    opt,
    'GET',
  )

  if (rst.status > 200) {
    return rst.msg || '网络错误'
  }

  return rst.data
}
