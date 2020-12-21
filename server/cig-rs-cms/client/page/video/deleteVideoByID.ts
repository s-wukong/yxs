import r from 'tool/request'

// 查询所有视频
export default async (opt) => {
  const rst = await r(
    '/api/video',
    opt,
    'DELETE',
  )

  if (rst.status > 200) {
    return rst.msg || '网络错误'
  }

  return rst.data
}
