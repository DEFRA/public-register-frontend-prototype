'use strict'

const { Views } = require('../constants')

module.exports = {
  method: 'GET',
  handler: async (request, h) => {
    let permitNumber
    const register =
      request.query && request.query.register ? decodeURIComponent(request.query.register) : 'Not specified'

    if (request.params) {
      permitNumber = decodeURIComponent(request.params.id)
    }

    return h.view(Views.PERMIT_NOT_FOUND.route, {
      pageHeading: Views.PERMIT_NOT_FOUND.pageHeading,
      permitNumber,
      register
    })
  }
}
