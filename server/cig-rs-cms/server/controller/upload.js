const fs = require('fs')
const path = require('path')

const upload = async (ctx) => {
  try {
    const {
      file,
    } = ctx.request.files
    const {
      fileType,
    } = ctx.request.body
    const reader = fs.createReadStream(file.path)
    const fileName = `${fileType}_${Date.now()}_.${file.name.split('.').pop().toLowerCase()}`
    const filePath = `${path.join(__dirname, '../../upload')}/${fileName}`
    console.log(filePath)
    const upStream = fs.createWriteStream(filePath)
    reader.pipe(upStream)
    const rst = fileName

    ctx.body = {
      code: rst ? 0 : 1,
      msg: !rst || !rst.length ? '没有匹配的查询结果' : '',
      data: rst || [],
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
  'POST /upload': upload,
}
