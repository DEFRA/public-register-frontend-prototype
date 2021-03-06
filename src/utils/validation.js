'use strict'

const Hoek = require('@hapi/hoek')
const { logger } = require('defra-logging-facade')

const VALIDATION_SUMMARY_HEADING = 'There is a problem'

const _mapErrorsForDisplay = (errorDetails, messages) => {
  return {
    titleText: VALIDATION_SUMMARY_HEADING,
    errorList: errorDetails.map(err => {
      const name = err.context.key || err.context.peer
      const message = (messages[name] && messages[name][err.type]) || err.message

      return {
        href: `#${name}`,
        name: name,
        text: message
      }
    })
  }
}

const _formatErrors = (errorResults, messages) => {
  const errorSummary = _mapErrorsForDisplay(errorResults.details, messages)
  const fieldErrors = {}
  if (errorSummary) {
    for (const { name, text } of errorSummary.errorList) {
      fieldErrors[name] = { text }
    }
  }
  const value = errorResults._original || {}
  return { value, errorSummary, fieldErrors }
}

/**
 * Handle validation errors
 * @param {Object} request - The request object
 * @param {Object} h - Hapi object
 * @param {Object} errors - The error messages to be displayed
 * @param {String} view - The view that should be displayed
 * @param {any} viewContext - Object containing the form data
 * @param {messages} messages - Object containing the validation messages
 */
const handleValidationErrors = async (request, h, errors, view, viewContext = {}, messages = {}) => {
  const context = Hoek.clone(viewContext)

  // If any of the viewData properties are a function, execute it and return the result
  await Promise.all(
    Object.entries(context).map(async ([prop, val]) => {
      if (typeof val === 'function') {
        try {
          context[prop] = await val(request)
        } catch (e) {
          logger.error(`viewData['${prop}'] failed as a function with: `, e)
        }
      }
    })
  )

  // Merge the viewData with the formatted error messages
  Hoek.merge(context, _formatErrors(errors, messages), { mergeArrays: false })

  return h
    .view(view, context)
    .code(400)
    .takeover()
}

/**
 * Raise custom validation errors
 * @param {Object} h - Hapi object
 * @param {String} view - The view that should be displayed
 * @param {any} formData - Object containing the form data
 * @param {messages} errorSummary - Object containing the information to be displayed in the error summary
 * @param {messages} fieldError - Object containing the field-level error information
 */

const raiseCustomValidationError = (h, view, formData, errorSummary, fieldError) => {
  const viewData = {
    ...formData,
    errorSummary: {
      titleText: errorSummary.heading,
      errorList: [
        {
          href: errorSummary.useHref ? `#${errorSummary.fieldId}` : null,
          name: errorSummary.fieldName,
          text: errorSummary.errorText
        }
      ]
    },
    fieldErrors: {
      [fieldError.fieldId]: {
        text: fieldError.errorText
      }
    }
  }

  return h
    .view(view, viewData)
    .code(400)
    .takeover()
}

module.exports = {
  handleValidationErrors,
  raiseCustomValidationError
}
