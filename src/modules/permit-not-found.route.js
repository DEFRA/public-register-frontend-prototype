'use strict'

const { Views } = require('../constants')

module.exports = {
  method: 'GET',
  handler: async (request, h) => {
    let permitNumber
    if (request.params) {
      permitNumber = request.params.id
    }

    return h.view(Views.PERMIT_NOT_FOUND.route, {
      pageHeading: Views.PERMIT_NOT_FOUND.pageHeading,
      permitNumber
    })
  }
}
