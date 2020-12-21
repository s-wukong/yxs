const fs = require('fs')
const path = require('path')

const file = {}

file.readSync = (f) => {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, '../', f))
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

file.writeFile = (f, data) => fs.writeFile(path.resolve(__dirname, '../', f), JSON.stringify(data), (e) => console.log(e))

module.exports = file
