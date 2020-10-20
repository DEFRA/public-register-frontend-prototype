'use strict'

const { setQueryData, getQueryData } = require('@envage/hapi-govuk-journey-map')

module.exports = [{
  method: 'GET',
  handler: (request, h) => {
    const { knowPermitNumber, permitNumber } = getQueryData(request)
    console.log(knowPermitNumber)
    console.log(permitNumber)

    // console.log('got payload:', request.payload)
    return h.view('enter-permit-number', {
      data: { knowPermitNumber, permitNumber }
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
    const { knowPermitNumber, permitNumber } = request.payload
    // const { knowPermitNumber, permitNumber } = await getQueryData(request)

    console.log('##### got payload: ', request.payload)

    setQueryData(request, {
      knowPermitNumber,
      permitNumber
    })

    return h.continue
  }
}]
