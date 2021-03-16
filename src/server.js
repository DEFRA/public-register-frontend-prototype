'use strict'

const Hapi = require('@hapi/hapi')
const Bcrypt = require('bcrypt')
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

const users = {
  defra: {
    username: 'defra',
    password: '$2a$04$cIFq2TKhfYzmccljQdnzp.57V8Az61o7SUIIfUK.Bioc49q7YhlLm'
  }
}

const validate = async (request, username, password) => {
  const user = users[username]
  if (!user) {
    return { credentials: null, isValid: false }
  }

  const isValid = await Bcrypt.compare(password, user.password)
  const credentials = { id: user.id, name: user.name }

  return { isValid, credentials }
}

const init = async () => {
  if (config.useBasicAuth) {
    await server.register(require('@hapi/basic'))
    server.auth.strategy('simple', 'basic', { validate })
    server.auth.default('simple')
  }

  await server.register(require('./plugins/back-link.plugin'))
  await server.register(require('./plugins/blipp.plugin'))
  await server.register(require('./plugins/disinfect.plugin'))
  await server.register(require('./plugins/frontend.plugin'))
  await server.register(require('./plugins/hapi-sanitize-payload.plugin'))
  await server.register(require('./plugins/inert.plugin'))
  await server.register(require('./plugins/journey-map.plugin'))
  await server.register(require('./plugins/logging.plugin'))
  await server.register(require('./plugins/robots.plugin'))

  server.route({
    method: 'GET',
    path: '/images/{file*}',
    handler: {
      directory: {
        path: 'public/build/images'
      }
    }
  })

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
