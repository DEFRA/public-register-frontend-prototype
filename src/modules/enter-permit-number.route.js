'use strict'

const Joi = require('joi')
const { handleValidationErrors } = require('../utils/validation')
const { setQueryData } = require('@envage/hapi-govuk-journey-map')
const view = 'enter-permit-number'

module.exports = [{
  method: 'GET',
  handler: (request, h) => {
    return h.view(view, {})
  }
}, {
  method: 'POST',
  handler: async (request, h) => {
    const { knowPermitNumber, permitNumber } = request.payload

    await setQueryData(request, {
      knowPermitNumber,
      permitNumber: knowPermitNumber === 'yes' ? permitNumber : null
    })

    return h.continue
  },
  options: {
    validate: {
      payload: Joi.object({
        permitNumber: Joi.string().when('knowPermitNumber', { is: 'yes', then: Joi.string().trim().required() }),
        knowPermitNumber: Joi.string().trim().required()
      }),

      failAction: async (request, h, errors) => {
        const data = {
          knowPermitNumber: request.payload.knowPermitNumber,
          permitNumber: request.payload.permitNumber
        }

        const messages = {
          knowPermitNumber: {
            'any.required': 'Select an option'
          },
          permitNumber: {
            'any.required': 'Enter permit number'
          }
        }

        return handleValidationErrors(request, h, errors, view, data, messages)
      }
    }
  }
}]
