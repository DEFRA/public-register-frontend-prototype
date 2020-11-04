'use strict'

const Hapi = require('@hapi/hapi')
const Bcrypt = require('bcrypt')

const config = require('./config/config')
const { logger } = require('defra-logging-facade')
const appVersion = require('../package.json').version

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
  await server.register(require('@hapi/basic'))

  server.auth.strategy('simple', 'basic', { validate })
  server.auth.default('simple')

  await server.register(require('./plugins/back-link.plugin'))
  await server.register(require('./plugins/blipp.plugin'))
  // await server.register(require('./plugins/csrf-crumb.plugin'))
  await server.register(require('./plugins/disinfect.plugin'))
  await server.register(require('./plugins/frontend.plugin'))
  await server.register(require('./plugins/hapi-sanitize-payload.plugin'))
  await server.register(require('./plugins/journey-map.plugin'))
  await server.register(require('./plugins/logging.plugin'))
  await server.register(require('./plugins/robots.plugin'))

  await server.start()

  logger.info(`Server running at: ${server.info.uri}`)
  logger.info(`Environment: ${config.environment}`)
  logger.info(`PRoD version: ${appVersion}`)
  logger.info(`App Insights key: ${config.appInsightsInstrumentationKey}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()

module.exports = server
