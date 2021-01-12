'use strict'

const { Views } = require('../constants')

module.exports = [
  {
    method: 'GET',
    handler: async (request, h) => {
      return h.view(Views.CONTACT_COMPLETE.route, {
        pageHeading: Views.CONTACT_COMPLETE.pageHeading
      })
    }
  }
]
