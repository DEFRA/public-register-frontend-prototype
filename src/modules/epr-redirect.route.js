'use strict'

const config = require('../config/config')

const eprUrl = config.eprUrl

module.exports = [
  {
    method: 'GET',
    handler: async (request, h) => {
      return h.redirect(eprUrl)
    }
  }
]
