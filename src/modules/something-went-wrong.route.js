'use strict'

const { Views } = require('../constants')

module.exports = {
  method: 'GET',
  handler: async (request, h) => {
    return h.view(Views.SOMETHING_WENT_WRONG.route, {
      pageHeading: Views.SOMETHING_WENT_WRONG.pageHeading
    })
  }
}
