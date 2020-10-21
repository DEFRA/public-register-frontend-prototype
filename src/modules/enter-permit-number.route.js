const Hoek = require('@hapi/hoek')
const Joi = require('joi')
const { failWith } = require('../utils/validation')
const { setQueryData, getQueryData, getCurrent } = require('@envage/hapi-govuk-journey-map')
const view = 'enter-permit-number'

function mapErrorsForDisplay (details, messages) {
  return {
    titleText: 'Fix the following errors',
    errorList: details.map(err => {
      const name = err.path[0]
      const message = (messages[name] && messages[name][err.type]) || err.message

      return {
        href: `#${name}`,
        name: name,
        text: message
      }
    })
  }
}

function formatErrors (result, messages) {
  const errorSummary = mapErrorsForDisplay(result.details, messages)
  const errors = {}
  if (errors) {
    errorSummary.errorList.forEach(({ name, text }) => {
      errors[name] = { text }
    })
  }
  const value = result._original || {}
  return { value, errorSummary, errors }
}

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

      failAction: async (request, h, errors) => {
        console.log('fail action here')

        console.error(errors)

        const data = {
          knowPermitNumber: request.payload.knowPermitNumber,
          permitNumber: request.payload.permitNumber
        }

        console.log('####### failWith func')
        const viewData = Hoek.clone(data)

        console.log('####### failWith viewData:', viewData)

        // If any of the viewData properties are a function, execute it and return the result
        await Promise.all(Object.entries(viewData).map(async ([prop, val]) => {
          if (typeof val === 'function') {
            try {
              viewData[prop] = await val(request)
            } catch (e) {
              // logger.error(`viewData['${prop}'] failed as a function with: `, e)
            }
          }
        }))

        const messages = {
          knowPermitNumber: {
            'any.required': 'Select an option'
          },
          permitNumber: {
            'any.required': 'Enter permit number'
          }
        }

        // Merge the viewData with the formatted error messages
        Hoek.merge(viewData, await formatErrors(errors, messages),
          { mergeArrays: false })

        return h.view(view, viewData).takeover()
      }

      // failAction: async (request, h, err) => {
      //   console.log('fail action here')
      //   return failWith(view,
      //     // { pageHeading: getPageHeading, hint: getHint, items: getItems }, {
      //     // { knowPermitNumber: 'yes', permitNumber: '12345' },
      //     { knowPermitNumber: 'yes', permitNumber: '12345' },
      //     {
      //       knowPermitNumber: {
      //         'any.required': 'Select an option'
      //       },
      //       permitNumber: {
      //         'any.required': 'Enter permit number'
      //       }
      //     }).takeover()
      // return h.continue
      // console.error(err)
      // return h.view(view, {
      //   knowPermitNumber: 'yes',
      //   permitNumber: '123'
      // }).takeover()
      // }

      // failAction: failWith(view,
      //   // { pageHeading: getPageHeading, hint: getHint, items: getItems }, {
      //   // { knowPermitNumber: 'yes', permitNumber: '12345' },
      //   { knowPermitNumber: 'yes', permitNumber: '12345' },
      //   {
      //     knowPermitNumber: {
      //       'any.required': 'Select an option'
      //     },
      //     permitNumber: {
      //       'any.required': 'Enter permit number'
      //     }
      //   })
    }
  }
}]
