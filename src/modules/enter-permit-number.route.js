const Joi = require('@hapi/joi')
const { failWith } = require('../utils/validation')
const { setQueryData, getQueryData, getCurrent } = require('@envage/hapi-govuk-journey-map')
const view = 'enter-permit-number'

// function getKnowPermitNumber() {
//   return
// }
// function getOptions (request) {
//   const route = getCurrent(request)
//   const { options } = route.parent
//   return options
// }

// function getPageHeading (request) {
//   const { questionHeading } = getOptions(request)
//   return questionHeading
// }

// function getHint (request) {
//   const { hint } = getOptions(request)
//   return { text: hint }
// }

function getItems (request) {
  console.log('@@@@@@ GET ITEMS')
  console.log('@@@@@@ GET ITEMS')
  // console.log('@@@@@@ GET ITEMS request:', request)

  // const { items, answerProperty } = getOptions(request)

  // const queryData = getQueryData(request)

  // return items.map(({ value, text, hint }) => {
  // return [{
  //   value: 'yes',
  //   text: 'Yaaaas'
  // }, {
  //   value: 'no',
  //   text: 'Noooo'
  // }]
  // console.log('£££ got query data:', queryData)

  // })

  const data = {
    knowPermitNumber: request.payload.knowPermitNumber,
    permitNumber: request.payload.permitNumber
  }

  console.log('get items data:', data)

  // DOESNT WORK - no Query Data
  return {
    // knowPermitNumber: queryData.knowPermitNumber,
    // permitNumber: queryData.permitNumber

    knowPermitNumber: request.payload.knowPermitNumber,
    permitNumber: request.payload.permitNumber

    // knowPermitNumber: 'yes',
    // permitNumber: '999'
  }

  // THIS WORKS
  // return {
  //   permitNumber: '999',
  //   knowPermitNumber: 'yes'
  // }
}

module.exports = [{
  method: 'GET',
  handler: (request, h) => {
    console.log('###### GET #######')

    // const { knowPermitNumber, permitNumber } = getQueryData(request)
    // console.log('request.payload:', request.payload)
    // console.log('knowPermitNumber:', knowPermitNumber)
    // console.log('permitNumber:', permitNumber)

    // console.log('got payload:', request.payload)
    return h.view(view, {
      // knowPermitNumber,
      // permitNumber

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
    console.log('###### POST #######')

    const { knowPermitNumber, permitNumber } = request.payload

    console.log('##### got payload: ', request.payload)

    await setQueryData(request, {
      knowPermitNumber,
      permitNumber: knowPermitNumber === 'yes' ? permitNumber : null
    })

    return h.continue
  },
  options: {
    validate: {
      payload: Joi.object({
        permitNumber: Joi.string().when('knowPermitNumber', { is: 'yes', then: Joi.string().trim().required().max(3) }),
        knowPermitNumber: Joi.string().trim().required()
      }),
      failAction: failWith(view,
        // { pageHeading: getPageHeading, hint: getHint, items: getItems }, {
        // { knowPermitNumber: 'yes', permitNumber: '12345' },
        { getItems },
        {
          knowPermitNumber: {
            'any.required': 'Select an option'
          },
          permitNumber: {
            'any.required': 'Enter permit number'
          }
        })
    }
  }
}]
