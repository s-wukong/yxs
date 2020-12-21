module.exports = async (ctx, next) => {
  const login = ctx.cookies.get('login')
  if (
    !login
    && ctx.request.url.startsWith('/api')
    && ctx.request.url !== '/api/login'
    && ctx.request.url !== '/api/wiki/feed_cache'
    && ctx.request.url !== '/api/wiki/collect_cache'
    && ctx.request.url !== '/api/wiki/download_cache'
    && ctx.request.url !== '/api/user/score_cache'
    && ctx.request.url !== '/api/user/invite_cache'
    && ctx.request.url !== '/api/user/collect_cache'
    && ctx.request.url !== '/api/user/download_cache'
  ) {
    ctx.body = {
      code: 2,
      msg: '用户未登录',
      data: '/login',
    }
  } else {
    await next()
  }
}
