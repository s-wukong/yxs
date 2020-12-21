import r from 'tool/request'

// 获取 tag 列表
export default async (opt) => {
  const rst = await r(
    '/api/tag',
    opt,
    'GET',
  )

  if (rst.status > 200) {
    return rst.msg || '网络错误'
  }

  return rst.data
}
