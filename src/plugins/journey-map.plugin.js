'use strict'

const cache = {}

const { resolve } = require('path')

// Plugin makes it easier to visualise, create and maintain journeys through a hapi web service.
module.exports = {
  plugin: require('@envage/hapi-govuk-journey-map'),
  options: {
    modulePath: resolve(`${process.cwd()}/src/modules`),
    setQueryData: (request, data) => {
      console.log('####### JMP setQueryData')

      Object.assign(cache, data)
    },
    getQueryData: (request) => {
      console.log('####### JMP getQueryData')

      return { ...cache }
    },
    journeyMapPath: '/journey-map'
  }
}
