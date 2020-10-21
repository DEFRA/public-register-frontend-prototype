'use strict'

const Hoek = require('@hapi/hoek')
const { logger } = require('defra-logging-facade')

function _mapErrorsForDisplay (details, messages) {
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

function _formatErrors (result, messages) {
  const errorSummary = _mapErrorsForDisplay(result.details, messages)
  const errors = {}
  if (errors) {
    errorSummary.errorList.forEach(({ name, text }) => {
      errors[name] = { text }
    })
  }
  const value = result._original || {}
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
async function handleValidationErrors (request, h, errors, view, data = {}, messages = {}) {
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

  return h.view(view, viewData).code(400).takeover()
}

module.exports = {
  handleValidationErrors
}
