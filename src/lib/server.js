'use strict'

const Hapi = require('@hapi/hapi')

const server = Hapi.server({
  port: 3000,
  host: '0.0.0.0'
})

exports.init = async () => {
  await server.initialize()
  return server
}

exports.start = async () => {
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
  console.log(`Server running at: ${server.info.uri}`)
  return server
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})
