import r from 'tool/request'

// 添加wiki
export default async (opt) => {
  const rst = await r(
    '/api/wiki',
    opt,
    'POST',
  )

  if (rst.status > 200) {
    return rst.msg || '网络错误'
  }

  return rst.data
}
