'use strict'

const { Registers, Views } = require('../constants')

const registers = [
  {
    value: Registers.WASTE_OPERATIONS,
    text: Registers.WASTE_OPERATIONS,
    checked: true
  },
  {
    value: Registers.WASTE_OPERATIONS,
    text: Registers.END_OF_LIFE_VEHICLES
  },
  {
    value: Registers.INSTALLATIONS,
    text: Registers.INSTALLATIONS
  },
  {
    value: Registers.RADIOACTIVE_SUBSTANCES,
    text: Registers.RADIOACTIVE_SUBSTANCES
  },
  {
    value: Registers.DISCHARGES_TO_WATER_AND_GROUNDWATER,
    text: Registers.DISCHARGES_TO_WATER_AND_GROUNDWATER_DISPLAY_VALUE
  }
]

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
    register: request.payload ? request.payload.register : null,
    registers
  }
}
