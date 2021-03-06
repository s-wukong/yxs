import r from 'tool/request'

// 修改wiki
export default async (opt) => {
  const rst = await r(
    '/api/publicity',
    opt,
    'PUT',
  )

  if (rst.status > 200) {
    return rst.msg || '网络错误'
  }

  return rst.data
}
