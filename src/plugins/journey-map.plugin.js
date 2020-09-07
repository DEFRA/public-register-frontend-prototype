'use strict'

const cache = {}

const { resolve } = require('path')

// Plugin makes it easier to visualise, create and maintain journeys through a hapi web service.
module.exports = {
  plugin: require('@envage/hapi-govuk-journey-map'),
  options: {
    modulePath: resolve(`${process.cwd()}/src/modules`),
    setQueryData: (request, data) => {
      Object.assign(cache, data)
    },
    getQueryData: (request) => {
      return { ...cache }
    },
    journeyMapPath: '/journey-map'
  }
}
