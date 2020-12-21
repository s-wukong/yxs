const env = process.env.MYSQL

const master = {
  username: 'cigrs',
  password: 'CigrsJez&I',
  database: 'cigrs',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    underscored: false,
    timestamps: true,
    freezeTableName: true,
  },
  port: 3306,
}

if (env === 'dev') master.host = '172.16.250.144'
if (env === 'dev') master.port = 13306
if (env === 'qa') master.host = '172.16.8.150'
if (env === 'prod') master.host = 'nx-eyesight.c2jeil0ybxmx.rds.cn-northwest-1.amazonaws.com.cn'

module.exports = {
  master,
}
