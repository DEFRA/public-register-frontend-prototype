const Joi = require('@hapi/joi')
const { failWith } = require('../utils/validation')
const { setQueryData, getQueryData, getCurrent } = require('@envage/hapi-govuk-journey-map')
const view = 'enter-permit-number'

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
  // const { items, answerProperty } = getOptions(request)
  // const queryData = getQueryData(request)
  // return items.map(({ value, text, hint }) => {
  return [{
    value: 'yes',
    text: 'Yes'
  }, {
    value: 'no',
    text: 'No'
  }]

  // })
}

module.exports = [{
  method: 'GET',
  handler: (request, h) => {
    const { knowPermitNumber, permitNumber } = getQueryData(request)
    console.log('###### GET #######')
    console.log('request.payload:', request.payload)
    console.log('knowPermitNumber:', knowPermitNumber)
    console.log('permitNumber:', permitNumber)

    // console.log('got payload:', request.payload)
    return h.view(view, {
      knowPermitNumber,
      permitNumber
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

    console.log('###### POST #######')
    console.log('##### got payload: ', request.payload)

    setQueryData(request, {
      knowPermitNumber,
      permitNumber: knowPermitNumber === 'yes' ? permitNumber : null
    })

    return h.continue
  },
  options: {
    validate: {
      payload: Joi.object({
        permitNumber: Joi.any().when('knowPermitNumber', { is: 'yes', then: Joi.string().trim().required() }),
        knowPermitNumber: Joi.string().trim().required()
      }),
      failAction: failWith(view,
        // { pageHeading: getPageHeading, hint: getHint, items: getItems }, {
        { items: getItems }, {
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
