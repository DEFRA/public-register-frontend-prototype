'use strict'

const Hoek = require('@hapi/hoek')
const { logger } = require('defra-logging-facade')

const _mapErrorsForDisplay = (errorDetails, messages) => {
  return {
    titleText: 'Fix the following errors:',
    errorList: errorDetails.map(err => {
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

const _formatErrors = (errorResults, messages) => {
  console.log('_formatErrors')
  console.log(errorResults)
  console.log(messages)

  const errorSummary = _mapErrorsForDisplay(errorResults.details, messages)
  const errors = {}
  if (errorSummary) {
    errorSummary.errorList.forEach(({ name, text }) => {
      errors[name] = { text }
    })
  }
  const value = errorResults._original || {}
  return { value, errorSummary, errors }
}

/**
 * Handle validation errors
 * @param {Object} request - The request object
 * @param {Object} h - Hapi object
 * @param {Object} errors - The error messages to be displayed
 * @param {String} view - The view that should be displayed
 * @param {any} data - Object containing the form data
 * @param {messages} messages - Object containing the validation messages
 */
const handleValidationErrors = async (request, h, errors, view, data = {}, messages = {}) => {
  const viewData = Hoek.clone(data)

  // If any of the viewData properties are a function, execute it and return the result
  await Promise.all(Object.entries(viewData).map(async ([prop, val]) => {
    if (typeof val === 'function') {
      try {
        viewData[prop] = await val(request)
      } catch (e) {
        logger.error(`viewData['${prop}'] failed as a function with: `, e)
      }
    }
  }))

  // Merge the viewData with the formatted error messages
  Hoek.merge(viewData, _formatErrors(errors, messages),
    { mergeArrays: false })

  console.log(JSON.stringify(viewData))

  return h.view(view, viewData).code(400).takeover()
}

module.exports = {
  handleValidationErrors
}
