'use strict'

const { Views } = require('../constants')

module.exports = {
  method: 'GET',
  handler: async (request, h) => {
    let permitNumber
    let register

    if (request.query) {
      permitNumber = decodeURIComponent(request.query.permitNumber)
      register = request.query.register ? decodeURIComponent(request.query.register) : 'Not specified'
    }

    return h.view(Views.PERMIT_NOT_FOUND.route, {
      pageHeading: Views.PERMIT_NOT_FOUND.pageHeading,
      permitNumber,
      register
    })
  }
}
