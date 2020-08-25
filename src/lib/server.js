'use strict'

const Hapi = require('@hapi/hapi')
const config = require('../config/config')
const { logger } = require('defra-logging-facade')
const AppInsightsService = require('../services/app-insights')

const server = Hapi.server({
  port: config.port,
  host: config.applicationUrl
})

exports.init = async () => {
  await server.initialize()
  return server
}

exports.start = async () => {
  console.log(AppInsightsService)

  // const appInsights = require('applicationinsights')
  // const isUsingAppInsights = config.appInsightsInstrumentationKey
  // if (isUsingAppInsights) {
  //   appInsights
  //     .setup(config.appInsightsInstrumentationKey)
  //     .start()
  // }

  await server.register(require('../plugins/back-link.plugin'))
  await server.register(require('../plugins/blipp.plugin'))
  await server.register(require('../plugins/csrf-crumb.plugin'))
  await server.register(require('../plugins/disinfect.plugin'))
  await server.register(require('../plugins/frontend.plugin'))
  await server.register(require('../plugins/hapi-sanitize-payload.plugin'))
  await server.register(require('../plugins/health.plugin'))
  await server.register(require('../plugins/journey-map.plugin'))
  await server.register(require('../plugins/logging.plugin'))
  await server.register(require('../plugins/robots.plugin'))
  await server.register(require('../plugins/service-status.plugin'))

  await server.start()
  logger.info(`Server running at: ${server.info.uri}`)
  logger.info(`Environment: ${config.environment}`)

  // if (isUsingAppInsights) {
  //   console.log('tracking event:', 'Server started')
  //   appInsights.defaultClient.trackEvent({ name: 'Server started', properties: { runningAt: `${server.info.uri}` } })
  // }

  // logger.info(`KEY: ${config.appInsightsInstrumentationKey}`)

  return server
}

process.on('unhandledRejection', (err) => {
  logger.error(err)
  process.exit(1)
})
