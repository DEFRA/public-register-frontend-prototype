'use strict'

const MiddlewareService = require('../services/middleware.service')
const { logger } = require('defra-logging-facade')
const config = require('../config/config')
const AppInsightsService = require('../services/app-insights')

module.exports = [{
  method: 'GET',
  handler: async (request, h) => {
    logger.info('******* You have just loaded the home page! *******')

    logger.info('VERSION: 3')

    logger.info(`KEY: ${config.appInsightsInstrumentationKey}`)

    AppInsightsService.defaultClient.trackEvent({ name: 'Home page loaded', properties: { runningAt: 'whatever' } })
    AppInsightsService.defaultClient.trackMetric({ name: 'DEFRA custom metric', value: 333 })

    const middlewareService = new MiddlewareService()
    const data = await middlewareService.getData('https://jsonplaceholder.typicode.com/todos/1')
    logger.info('got data', data)

    return h.view('home', {
      pageHeading: 'Welcome',
      pageText: 'Here is my first GOV.UK Design System styled page',
      data: data
    })
  }

}, {
  method: 'POST',
  handler: (request, h) => h.continue
}]
