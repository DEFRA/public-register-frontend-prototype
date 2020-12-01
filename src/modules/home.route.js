'use strict'

const { setQueryData } = require('@envage/hapi-govuk-journey-map')
const { Views } = require('../constants')

module.exports = [{
  method: 'GET',
  handler: (request, h) => {
    return h.view(Views.HOME.route, {
      pageHeading: Views.HOME.pageHeading,
      pageText: 'Use this service to obtain documents that are available on the public register'
    })
  }
}, {
  method: 'POST',
  handler: async (request, h) => {
    setQueryData(request, {
      knowPermitNumber: undefined,
      permitNumber: undefined
    })

    return h.continue
  }
}]
