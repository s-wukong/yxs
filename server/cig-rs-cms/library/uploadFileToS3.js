const AWS = require('aws-sdk')
const fs = require('fs')
const mime = require('mime')
const path = require('path')
// const gs = require('ghostscript-js')
// const gs = require('ghostscript4js')
const { execSync } = require('child_process')

AWS.config.update({
  credentials: new AWS.Credentials(
    'AKIATPJYAAUQ2YCR64PR',
    '2aCRvUEC14WM0pIvcauw7Gnz8KaeU528MbTykKq6',
  ),
  region: 'cn-northwest-1',
  output: 'json',
})

const s3 = new AWS.S3()
const env = process.env.MYSQL

const uploadFileToS3 = async (ctx, file, name, type) => {
  let newFile = file
  return new Promise(resolve => {
    const fileStreamLarge = fs.createReadStream(file)
    fileStreamLarge.on('error', err => console.log('File Error', err))
    // 上传原始文件 即 xxx_large.png or xxx_large.pdf
    s3.upload(
      {
        Bucket: `cigrs/${env}/${type}`,
        Key: name.replace('.', '_large.'),
        Body: fileStreamLarge,
        ContentType: mime.getType(file),
      },
      (err, data) => {
        if (err) resolve(false)
        resolve(data)
      },
    )
    // todo... video banner 确定尺寸后
    if (type === 'report-banner') {
      newFile = `${path.join(__dirname, '../upload')}/${type}_${Date.now()}_${name}`
      execSync(`ffmpeg -v quiet -i ${file} -s 354x198 ${newFile}`)
    } else if (type === 'video-banner') {
      newFile = `${path.join(__dirname, '../upload')}/${type}_${Date.now()}_${name}`
      execSync(`ffmpeg -v quiet -i ${file} -vf scale=1080:-1 ${newFile}`)
    } else if (type === 'pdf') {
      newFile = `${path.join(__dirname, '../upload')}/${type}_${Date.now()}_${name}`
      execSync(`gs -sDEVICE=pdfwrite -dNOPAUSE -dQUIET -dBATCH -dPDFSETTINGS=/screen -dCompatibilityLevel=1.4 -sOutputFile=${newFile} ${file}`)
    }
    // 上传压缩文件 即 xxx.png or xxx.pdf
    const fileStream = fs.createReadStream(newFile)
    s3.upload(
      {
        Bucket: `cigrs/${env}/${type}`,
        Key: name,
        Body: fileStream,
        ContentType: mime.getType(file),
      },
      (err, data) => {
        if (err) resolve(false)
        resolve(data)
      },
    )
  })
}

const deleteFileFromS3 = async (ctx, name, type) => {
  s3.deleteObject(
    {
      Bucket: `cigrs/${env}/${type}`,
      Key: name,
    },
    (err) => err & console.log(err)
  )
}

const generatePresignedURL = async (ctx, name, type) => {
  return s3.getSignedUrl(
    'getObject',
    {
      Bucket: `cigrs/${env}/${type}`,
      Key: name.replace(`/${type}/`, ''),
      Expires: 60 * 60 * 5,
    },
  )
}

module.exports = {
  uploadFileToS3,
  deleteFileFromS3,
  generatePresignedURL,
}
