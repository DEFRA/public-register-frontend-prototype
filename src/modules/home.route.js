'use strict'

const { setQueryData } = require('@envage/hapi-govuk-journey-map')

module.exports = [{
  method: 'GET',
  handler: (request, h) => {
    return h.view('home', {
      pageHeading: 'Public Register of Documents',
      pageText: 'Use this service to obtain documents from the Environment Agency Public Registers'
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
