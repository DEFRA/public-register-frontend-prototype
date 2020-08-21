const config = require('../config/config')

const cookieOptions = {
  isSecure: false,
  password: config.cookiePassword,
  isHttpOnly: true,
  clearInvalid: true,
  strictHeader: true
}

module.exports = {
  plugin: require('@hapi/crumb'),
  options: {
    cookieOptions,
    key: 'CsrfToken',
    autoGenerate: true,
    logUnauthorized: true
  }
}
