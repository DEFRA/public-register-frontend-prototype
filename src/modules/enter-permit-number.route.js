'use strict'

const { setQueryData, getQueryData } = require('@envage/hapi-govuk-journey-map')

module.exports = [{
  method: 'GET',
  handler: (request, h) => {
    // const { answer } = getQueryData(request)
    // console.log('got payload:', request.payload)
    return h.view('enter-permit-number', {
      // pageHeading: 'Do you know the permit number of the record you are looking for?',
      // answer
      // items: [
      //   {
      //     value: 'yes',
      //     text: 'Yes',
      //     checked: answer === 'yes'
      //   },
      //   {
      //     value: 'no',
      //     text: 'No',
      //     checked: answer === 'no'
      //   }
      // ]
    })
  }
}, {
  method: 'POST',
  handler: async (request, h) => {
    const { permitNumber } = request.payload
    console.log('got payload: ', request.payload)
    console.log('got permitNumber: ', permitNumber)
    console.log(request.payload.permitNumber)

    setQueryData(request, { knowPermitNumber: request.payload.knowPermitNumber })

    // await setQueryData(request, { permitNumber })
    // await setQueryData(request, { permitNumber: 2222 })
    return h.continue
  }
}]
