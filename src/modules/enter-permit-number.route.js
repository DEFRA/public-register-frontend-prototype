'use strict'

const Joi = require('joi')
const { logger } = require('defra-logging-facade')
const { handleValidationErrors, raiseCustomValidationError } = require('../utils/validation')
const { setQueryData } = require('@envage/hapi-govuk-journey-map')

const { Views } = require('../constants')
const MiddlewareService = require('../services/middleware.service')

const PERMIT_NUMBER_MAX_LENGTH = 20

module.exports = [{
  method: 'GET',
  handler: (request, h) => {
    return h.view(Views.ENTER_PERMIT_NUMBER.route, {
      pageHeading: Views.ENTER_PERMIT_NUMBER.pageHeading
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

    if (knowPermitNumber === 'no') {
      return h.continue
    }

    const middlewareService = new MiddlewareService()
    const permitExists = await middlewareService.checkPermitExists(permitNumber)

    if (!permitExists) {
      logger.info(`Permit number [${permitNumber}] not found`)
    }

    if (permitExists) {
      return h.redirect(`/${Views.VIEW_PERMIT_DETAILS.route}/${permitNumber}`)
    } else {
      return raiseCustomValidationError(h, Views.ENTER_PERMIT_NUMBER.route, { knowPermitNumber, permitNumber }, {
        heading: 'To continue, please address the following:',
        fieldId: 'permitNumber',
        errorText: 'Sorry, no permit was found',
        useHref: false
      }, {
        fieldId: 'permitNumber',
        errorText: 'Enter a different permit number'
      })
    }
  },
  options: {
    validate: {
      payload: Joi.object({
        permitNumber: Joi.string().when('knowPermitNumber', {
          is: 'yes', then: Joi.string().trim().required().max(PERMIT_NUMBER_MAX_LENGTH)
        }),
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

        return handleValidationErrors(request, h, errors, Views.ENTER_PERMIT_NUMBER.route, data, messages)
      }
    }
  }
}]
