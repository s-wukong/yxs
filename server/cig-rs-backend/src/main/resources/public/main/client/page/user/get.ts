import r from 'tool/request'

// 市场 - 互联网声量 - 地区分布
export default async (opt) => {
  const rst = await r(
    '/manage/user/findall',
    opt,
    'GET',
  )

  if (rst.status > 200) {
    return rst.msg || '网络错误'
  }

  return rst.data.users
}
