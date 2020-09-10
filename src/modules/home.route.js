'use strict'

const MiddlewareService = require('../services/middleware.service')
const { logger } = require('defra-logging-facade')
const AppInsightsService = require('../services/app-insights.service')
const appInsightsService = new AppInsightsService()
const appVersion = require('../../package.json').version

module.exports = [{
  method: 'GET',
  handler: async (request, h) => {
    // Logger example
    logger.info('******* You have just loaded the home page! *******')
    // ///////////////////////////

    appInsightsService.trackEvent({ name: 'Home page loaded', properties: { runningAt: 'whatever' } })

    appInsightsService.trackMetric({ name: 'DEFRA custom metric', value: 333 })

    // ePR POC //////////////////
    // Generate dummy result count to demonstrate use of event tracking in Azure Application Insights
    const randomNumber = Math.random()
    const isSuccessfulSearch = randomNumber > 0.5

    if (isSuccessfulSearch) {
      appInsightsService.trackEvent({ name: 'ePR Referral - success', properties: { resultCount: Math.round(randomNumber * 100) } })
    } else {
      appInsightsService.trackEvent({ name: 'ePR Referral - failure', properties: { resultCount: 0 } })
    }
    // ///////////////////////////

    // Middleware Integration
    const middlewareService = new MiddlewareService()
    const data = await middlewareService.search('4')

    data.version = appVersion
    console.log('app version:', appVersion)

    return h.view('home', {
      pageHeading: 'Welcome',
      pageText: 'This is a page to test integration with the PRoD middleware and other components',
      data: data
    })
    // ///////////////////////////
  }

}, {
  method: 'POST',
  handler: (request, h) => h.continue
}]
