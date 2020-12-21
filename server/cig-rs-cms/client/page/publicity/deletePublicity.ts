import r from 'tool/request'

// 删除 publicity
export default async (opt) => {
  const rst = await r(
    '/api/publicity',
    opt,
    'DELETE',
  )

  if (rst.status > 200) {
    return rst.msg || '网络错误'
  }

  return rst.data
}
