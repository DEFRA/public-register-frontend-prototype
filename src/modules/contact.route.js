'use strict'

const Joi = require('joi')

const config = require('../config/config')
const { Views } = require('../constants')

const NotificationService = require('../services/notification.service')
const { handleValidationErrors } = require('../utils/validation')

const DOCUMENT_REQUEST_MAX_CHARS = 5000

module.exports = [
  {
    method: 'GET',
    handler: async (request, h) => {
      const context = _getContext(request)
      return h.view(Views.CONTACT.route, context)
    }
  },
  {
    method: 'POST',
    handler: async (request, h) => {
      const context = _getContext(request)

      if (context.whatDoYouNeed && context.furtherInformation && context.email) {
        _sendMessages(context)
      }

      return h.continue
    },

    options: {
      validate: {
        payload: Joi.object({
          whatDoYouNeed: Joi.string()
            .trim()
            .required(),
          furtherInformation: Joi.string()
            .trim()
            .max(DOCUMENT_REQUEST_MAX_CHARS)
            .required(),
          email: Joi.string()
            .trim()
            .email()
            .required()
        }),
        options: {
          abortEarly: false
        },
        failAction: async (request, h, errors) => {
          const context = _getContext(request)

          const messages = {
            whatDoYouNeed: {
              'any.required': 'Select an option'
            },
            furtherInformation: {
              'any.required': 'Enter the further information',
              'string.max': `Enter shorter information with no more than ${DOCUMENT_REQUEST_MAX_CHARS} characters`
            },
            email: {
              'any.required': 'Enter an email address',
              'string.email': 'Enter an email address in the correct format, like name@example.com'
            }
          }

          return handleValidationErrors(request, h, errors, Views.CONTACT.route, context, messages)
        }
      }
    }
  }
]
const _getContext = request => {
  return {
    pageHeading: Views.CONTACT.pageHeading,
    whatDoYouNeed: request.payload ? request.payload.whatDoYouNeed : null,
    furtherInformation: request.payload ? request.payload.furtherInformation : null,
    email: request.payload ? request.payload.email : null,
    permitDetails: {
      permitNumber: request.query.permitNumber,
      site: request.query.site,
      register: request.query.register,
      address: request.query.address,
      postcode: request.query.postcode
    },
    maxlength: DOCUMENT_REQUEST_MAX_CHARS,
    timescale: config.informationRequestTimescale
  }
}

const _sendMessages = context => {
  const notificationService = new NotificationService()

  notificationService.sendNcccEmail(context)
  notificationService.sendCustomerEmail(context)
}
