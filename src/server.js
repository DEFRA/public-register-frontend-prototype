'use strict'

const Hapi = require('@hapi/hapi')
const { logger } = require('defra-logging-facade')

const { Views } = require('./constants')
const config = require('./config/config')
const NotifyRateLimitService = require('./services/notify-rate-limit.service')
const appVersion = require('../package.json').version

let notifyRateLimitService

const server = Hapi.server({
  port: config.port,
  host: config.applicationUrl
})

const init = async () => {
  await server.register(require('@hapi/basic'))

  await server.register(require('./plugins/back-link.plugin'))
  await server.register(require('./plugins/blipp.plugin'))
  await server.register(require('./plugins/disinfect.plugin'))
  await server.register(require('./plugins/frontend.plugin'))
  await server.register(require('./plugins/hapi-sanitize-payload.plugin'))
  await server.register(require('./plugins/journey-map.plugin'))
  await server.register(require('./plugins/logging.plugin'))
  await server.register(require('./plugins/robots.plugin'))

  await server.start()

  logger.info(`Server running at: [${server.info.uri}]`)
  logger.info(`Environment: [${config.environment}]`)
  logger.info(`PRoD version: [${appVersion}]`)
  logger.info(`App Insights key: [${config.appInsightsInstrumentationKey}]`)

  notifyRateLimitService = new NotifyRateLimitService()
}

process.on('unhandledRejection', err => {
  console.log(err)
  process.exit(1)
})

init()

server.ext('onPreResponse', (request, h) => {
  // Transform only server errors
  if (request.response.isBoom && request.response.isServer) {
    logger.error(request.response.message)
    return h.redirect(`/${Views.SOMETHING_WENT_WRONG.route}`)
  } else {
    return h.continue
  }
})

const registerNotifyMessages = messageCount => {
  return notifyRateLimitService.registerNotifyMessages(messageCount)
}

server.method({
  name: 'registerNotifyMessages',
  method: registerNotifyMessages,
  options: {}
})

module.exports = server
