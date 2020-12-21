const login = async (ctx) => {
  try {
    const {
      username,
      password,
    } = ctx.request.body
    const arr = [
      {
        username: 'admin',
        password: 'cigdata2020',
      },
      {
        username: 'szhyxs',
        password: 'szhyxs2020',
      },
    ]
    const rst = arr.find(v => (v.username === username && v.password === password))
    if (rst) {
      ctx.cookies.set(
        'login',
        1,
        {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 30,
          httpOnly: false,
          overwrite: false,
        },
      )
    }

    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst || !rst.length ? '账号或密码错误' : '',
      data: rst ? 1 : 0,
    }
  } catch (err) {
    ctx.logger.error(err)
    ctx.body = {
      code: 1,
      msg: 'error',
      data: [],
    }
  }
}

module.exports = {
  'POST /login': login,
}
