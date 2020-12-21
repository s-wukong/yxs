import r from 'tool/request'

// 查询所有用户
export default async (opt) => {
  const rst = await r(
    '/api/user',
    opt,
    'GET',
  )

  if (rst.status > 200) {
    return rst.msg || '网络错误'
  }

  return rst.data
}
