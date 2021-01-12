'use strict'

const Joi = require('joi')

const config = require('../config/config')
const { Views } = require('../constants')
const NotificationService = require('../services/notification.service')
const { handleValidationErrors } = require('../utils/validation')

const EMAIL_MAX_CHARS = 254
const DOCUMENT_REQUEST_MAX_CHARS = 2000

module.exports = [
  {
    method: 'GET',
    handler: async (request, h) => {
      const params = {
        maxlength: DOCUMENT_REQUEST_MAX_CHARS,
        timescale: config.documentRequestTimescale
      }

      const viewData = {
        pageHeading: Views.CONTACT.pageHeading,
        params
      }

      return h.view(Views.CONTACT.route, viewData)
    }
  },
  {
    method: 'POST',
    handler: async (request, h) => {
      const params = {
        documentRequestDetails: request.payload.documentRequestDetails,
        email: request.payload.email,
        maxlength: DOCUMENT_REQUEST_MAX_CHARS,
        timescale: config.documentRequestTimescale
      }

      if (params.documentRequestDetails && params.email) {
        // TODO handle failure
        _sendMessage(params.email, params.documentRequestDetails)
      }

      // TODO Result route
      return h.continue

      // TODO handle failure
      // return h.view(Views.CONTACT.route, {
      //   pageHeading: Views.CONTACT.pageHeading,
      //   params: params
      // })
    },

    options: {
      validate: {
        payload: Joi.object({
          documentRequestDetails: Joi.string()
            .trim()
            .max(DOCUMENT_REQUEST_MAX_CHARS)
            .required(),
          email: Joi.string()
            .trim()
            .max(EMAIL_MAX_CHARS)
            .email()
            .required()
        }),
        options: {
          abortEarly: false
        },
        failAction: async (request, h, errors) => {
          const messages = {
            documentRequestDetails: {
              'any.required': 'Enter the document request details',
              'string.max': `Enter a shorter document request with no more than ${DOCUMENT_REQUEST_MAX_CHARS} characters`,
              'object.with': 'Enter the document request details'
            },
            email: {
              'any.required': 'Enter an email address',
              'string.max': `Enter a shorter email address with no more than ${EMAIL_MAX_CHARS} characters`,
              'string.email': 'Enter an email address in the correct format, like name@example.com',
              'object.with': 'Enter an email address'
            }
          }

          const params = {
            documentRequestDetails: request.payload.documentRequestDetails,
            email: request.payload.email,
            maxlength: DOCUMENT_REQUEST_MAX_CHARS,
            timescale: config.documentRequestTimescale
          }

          const viewData = {
            pageHeading: Views.CONTACT.pageHeading,
            params
          }

          return handleValidationErrors(request, h, errors, Views.CONTACT.route, viewData, messages)
        }
      }
    }
  }
]

const _sendMessage = (emailAddress, messsage) => {
  const notificationService = new NotificationService()
  notificationService.sendMessage(emailAddress, messsage)
}
