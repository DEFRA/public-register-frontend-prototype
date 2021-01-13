'use strict'

const { setQueryData } = require('@envage/hapi-govuk-journey-map')
const Joi = require('joi')
const { logger } = require('defra-logging-facade')
const { handleValidationErrors, raiseCustomValidationError } = require('../utils/validation')
const { sanitisePermitNumber } = require('../utils/general')

const { Views } = require('../constants')
const MiddlewareService = require('../services/middleware.service')

const PERMIT_NUMBER_MAX_LENGTH = 20

module.exports = [
  {
    method: 'GET',
    handler: (request, h) => {
      const context = _getContext(request)
      return h.view(Views.ENTER_PERMIT_NUMBER.route, context)
    }
  },
  {
    method: 'POST',
    handler: async (request, h) => {
      const context = _getContext(request)

      await setQueryData(request, {
        knowPermitNumber: context.knowPermitNumber,
        permitNumber: context.knowPermitNumber === 'yes' ? context.permitNumber : null
      })

      if (context.knowPermitNumber === 'no') {
        return h.continue
      }

      const santisedPermitNumber = sanitisePermitNumber(context.permitNumber)

      const middlewareService = new MiddlewareService()
      const permitExists = await middlewareService.checkPermitExists(santisedPermitNumber)

      if (!permitExists) {
        logger.info(`Permit number [${context.permitNumber}] not found`)
      }

      if (permitExists) {
        return h.redirect(`/${Views.VIEW_PERMIT_DETAILS.route}/${santisedPermitNumber}`)
      } else {
        return raiseCustomValidationError(
          h,
          Views.ENTER_PERMIT_NUMBER.route,
          context,
          {
            heading: 'To continue, please address the following:',
            fieldId: 'permitNumber',
            errorText: 'Sorry, no permit was found',
            useHref: false
          },
          {
            fieldId: 'permitNumber',
            errorText: 'Enter a different permit number'
          }
        )
      }
    },
    options: {
      validate: {
        payload: Joi.object({
          permitNumber: Joi.string().when('knowPermitNumber', {
            is: 'yes',
            then: Joi.string()
              .trim()
              .required()
              .max(PERMIT_NUMBER_MAX_LENGTH)
          }),
          knowPermitNumber: Joi.string()
            .trim()
            .required()
        }),

        failAction: async (request, h, errors) => {
          const context = _getContext(request)

          const messages = {
            knowPermitNumber: {
              'any.required': 'Select an option'
            },
            permitNumber: {
              'any.required': 'Enter the permit number',
              'string.max': `Enter a shorter permit number with no more than ${PERMIT_NUMBER_MAX_LENGTH} characters`
            }
          }

          return handleValidationErrors(request, h, errors, Views.ENTER_PERMIT_NUMBER.route, context, messages)
        }
      }
    }
  }
]

const _getContext = request => {
  return {
    pageHeading: Views.ENTER_PERMIT_NUMBER.pageHeading,
    knowPermitNumber: request.payload ? request.payload.knowPermitNumber : null,
    permitNumber: request.payload ? request.payload.permitNumber : null
  }
}
