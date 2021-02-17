'use strict'

const { Views } = require('../constants')

module.exports = [
  {
    method: 'GET',
    handler: async (request, h) => {
      const context = _getContext(request)

      return h.view(Views.SELECT_REGISTER.route, context)
    }
  },
  {
    method: 'POST',
    handler: async (request, h) => {
      const context = _getContext(request)
      return h.redirect(`/${Views.ENTER_PERMIT_NUMBER.route}?register=${context.register}`)
    }
  }
]

const _getContext = request => {
  return {
    pageHeading: Views.SELECT_REGISTER.pageHeading,
    register: request.payload ? request.payload.register : null
  }
}
