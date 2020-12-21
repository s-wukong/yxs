const {
  createLogger,
  transports,
  format: {
    combine,
    json,
    printf,
    timestamp,
  },
} = require('winston')
const stackTrace = require('stack-trace')
const sequelize = require('./sequelize')


// 日志级别
const levels = {
  error: 0, // 错误
  warn: 1, // 提示
  info: 2, // 信息
  verbose: 3, // 长的
  debug: 4, // 调试
  silly: 5, // 普通
}

module.exports = async (ctx, next, app) => {
  const APP = app
  // 格式化输出内容
  const formatter = combine(
    json(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
    printf((info) => {
      const req = ctx.request
      const showInfo = {
        time: info.timestamp,
        pid: process.pid,
        level: info.level,
        message: info.level === 'error' ? info.message.stack : info.message,
        func: info.functionName,
        line: info.lineNumber,
        column: info.columnNumber,
        file: info.fileName,
        method: req.method,
        url: req.url,
        userAgent: req.header['user-agent'],
        ip: req.ip || req.headers['X-Orig-IP'],
        body: JSON.stringify(req.body) || null,
        // header: JSON.stringify(req.header),
      }
      return JSON.stringify(showInfo, null, 2)
    }),
  )

  const logger = createLogger({
    levels,
    format: formatter,
    transports: [
      // console
      new transports.Console({}),
    ],
    // 异常不会退出进程
    exitOnError: false,
  })


  const errorMethod = logger.error
  logger.error = (...args) => {
    const st = stackTrace.get()[1]

    errorMethod.call(
      logger,
      args[0],
      {
        typeName: st.getTypeName(),
        functionName: st.getFunctionName(),
        fileName: st.getFileName(),
        lineNumber: st.getLineNumber(),
        columnNumber: st.getColumnNumber(),
      },
    )
  }

  const warnMethod = logger.warn
  logger.warn = (...args) => {
    const st = stackTrace.get()[1]
    let argz = args
    argz = Array.prototype.slice.call(argz)
    argz = argz.map((v) => {
      if (typeof v === 'object') {
        return JSON.stringify(v)
      }
      return v
    })
    argz = argz.length > 1 ? argz.join(' ') : argz[0]

    warnMethod.call(
      logger,
      argz,
      {
        typeName: st.getTypeName(),
        functionName: st.getFunctionName(),
        fileName: st.getFileName(),
        lineNumber: st.getLineNumber(),
        columnNumber: st.getColumnNumber(),
      },
    )
  }

  const infoMethod = logger.info
  logger.info = (...args) => {
    let argz = args
    const st = stackTrace.get()[1]
    if (typeof argz[0] === 'object' && argz[0] !== null) {
      argz = Array.prototype.slice.call(argz)
    }
    argz = argz.map((v) => {
      if (typeof v === 'object') {
        return JSON.stringify(v)
      }
      return v
    })
    argz = argz.length > 1 ? argz.join(' ') : argz[0]

    infoMethod.call(
      logger,
      argz,
      {
        typeName: st.getTypeName(),
        functionName: st.getFunctionName(),
        fileName: st.getFileName(),
        lineNumber: st.getLineNumber(),
        columnNumber: st.getColumnNumber(),
      },
    )
  }

  APP.context.logger = logger
  if (
    process.env.NODE_ENV === 'development'
    || process.env.NODE_ENV === 'wds'
  ) {
    sequelize.options.logging = console.log
  } else if (process.env.NODE_ENV === 'test') {
    sequelize.options.logging = null
  } else {
    sequelize.options.logging = logger.info
  }
  await next()
}
