import r from 'tool/request'

// 添加视频
export default async (opt) => {
  const rst = await r(
    '/api/video',
    opt,
    'POST',
  )

  if (rst.status > 200) {
    return rst.msg || '网络错误'
  }

  return rst.data
}
