const dotenv = require('dotenv')
// Configura dotenv
dotenv.config()

module.exports = {
  local: {
    username: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.NAME_DB,
    host: process.env.HOST_DB,
    dialect: process.env.DIALECT_DB
  },
  development: {
    username: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.NAME_DB,
    host: process.env.HOST_DB,
    dialect: process.env.DIALECT_DB
  },
  test: {
    username: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.NAME_DB,
    host: process.env.HOST_DB,
    dialect: process.env.DIALECT_DB
  },
  production: {
    username: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.NAME_DB,
    host: process.env.HOST_DB,
    dialect: process.env.DIALECT_DB
  }
}
