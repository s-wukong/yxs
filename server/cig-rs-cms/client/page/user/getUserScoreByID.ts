import r from 'tool/request'

// 用户积分列表
export default async (opt) => {
  const rst = await r(
    '/api/user/score',
    opt,
    'GET',
  )

  if (rst.status > 200) {
    return rst.msg || '网络错误'
  }

  return rst.data
}
