'use strict'

const Joi = require('joi')
const { handleValidationErrors } = require('../utils/validation')
const { setQueryData } = require('@envage/hapi-govuk-journey-map')
const view = 'enter-permit-number'

const PERMIT_NUMBER_MAX_LENGTH = 20

module.exports = [{
  method: 'GET',
  handler: (request, h) => {
    return h.view(view, {
      pageHeading: 'Do you know the permit number of the record you are looking for?'
    })
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
        permitNumber: Joi.string().when('knowPermitNumber', { is: 'yes', then: Joi.string().trim().required().max(PERMIT_NUMBER_MAX_LENGTH) }),
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
            'any.required': 'Enter the permit number',
            'string.max': `Enter a shorter permit number with no more than ${PERMIT_NUMBER_MAX_LENGTH} characters`
          }
        }

        return handleValidationErrors(request, h, errors, view, data, messages)
      }
    }
  }
}]
