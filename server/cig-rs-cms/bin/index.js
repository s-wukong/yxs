const Koa = require('koa')
const path = require('path')
const cors = require('kcors')
const webpack = require('webpack')
const serve = require('koa-static')
const onerror = require('koa-onerror')
const bodyParser = require('koa-body')
const koaWebpack = require('koa-webpack')

const sql = require('../library/sql')
const route = require('../server/route')
const appConfig = require('../config/app')
const logger = require('../library/logger')
const render = require('../library/render')
const login = require('../library/isLogin')
const cache = require('../library/update_cache')
const config = require('../config/dev.config.js')

const app = new Koa()
const port = process.env.PORT || appConfig.port || 8802

app.use(cors())
app.use(
  bodyParser({
    multipart: true,
    parsedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
)
app.use(serve(path.resolve(__dirname, '../asset/')))
app.use(serve(path.resolve(__dirname, '../upload/')))
if (process.env.NODE_ENV === 'wds') {
  (async () => {
    const compiler = webpack(config)
    const middleware = await koaWebpack({
      compiler,
    })
    app.use(middleware)
  })()
}
app.use(async (ctx, next) => login(ctx, next, app))
app.use(async (ctx, next) => logger(ctx, next, app))
app.use(async (ctx, next) => sql(ctx, next, app))
app.use(async (ctx, next) => {
  if (ctx.path.match(/^\/api/)) {
    const router = await route()(ctx, next)
    return router
  }
  const rendering = await render(ctx, next)
  return rendering
})

if (process.env.NODE_ENV === 'wds') {
  onerror(app)
}

app.on('error', (e, ctx) => ctx.logger.error(e))
cache()

app.listen(port)
