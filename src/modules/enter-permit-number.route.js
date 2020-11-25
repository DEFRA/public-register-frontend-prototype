'use strict'

const Joi = require('joi')
const { logger } = require('defra-logging-facade')
const { handleValidationErrors } = require('../utils/validation')
const { setQueryData } = require('@envage/hapi-govuk-journey-map')

const MiddlewareService = require('../services/middleware.service')

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

    const middlewareService = new MiddlewareService()
    let permitData = await middlewareService.search(permitNumber)

    if (permitData.statusCode === 404) {
      logger.info(`Permit number ${permitNumber} not found`)
      permitData = null
    }

    if (permitData) {
      return h.continue
    } else {
      const viewData = {
        knowPermitNumber: 'yes',
        permitNumber,
        // TODO determine if this is needed
        // value: {
        //   knowPermitNumber: 'yes',
        //   permitNumber
        // },
        errorSummary: {
          titleText: 'To continue, please address the following:',
          errorList: [{
            href: '#permitNumber',
            name: 'permitNumber',
            text: 'Sorry, no permit was found'
          }]
        },
        errors: {
          // Field-level validation
          permitNumber: {
            text: 'Enter a different permit number'
          }
        }
      }

      return h.view(view, viewData).code(400).takeover()
    }
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
