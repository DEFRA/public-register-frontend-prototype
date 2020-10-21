'use strict'

// const MiddlewareService = require('../services/middleware.service')
const { logger } = require('defra-logging-facade')
// const AppInsightsService = require('../services/app-insights.service')
// const appInsightsService = new AppInsightsService()
// const appVersion = require('../../package.json').version

const { getQueryData } = require('@envage/hapi-govuk-journey-map')

module.exports = {
  method: 'GET',
  handler: async (request, h) => {
    // Logger example
    logger.info('Carrying out search for permit number: TODO')
    // ///////////////////////////

    // appInsightsService.trackEvent({ name: 'Carrying out search page loaded', properties: { runningAt: 'whatever' } })

    // appInsightsService.trackMetric({ name: 'DEFRA custom metric', value: 333 })

    // ePR POC //////////////////
    // Generate dummy result count to demonstrate use of event tracking in Azure Application Insights
    // const randomNumber = Math.random()
    // const isSuccessfulSearch = randomNumber > 0.5

    // if (isSuccessfulSearch) {
    //   appInsightsService.trackEvent({ name: 'ePR Referral - success', properties: { resultCount: Math.round(randomNumber * 100) } })
    // } else {
    //   appInsightsService.trackEvent({ name: 'ePR Referral - failure', properties: { resultCount: 0 } })
    // }
    // ///////////////////////////

    const { permitNumber } = await getQueryData(request)

    // console.log('!!!!!@@@@ query data:', await getQueryData(request))

    // Middleware Integration
    // const middlewareService = new MiddlewareService()
    // const data = await middlewareService.search(permitNumber)

    // console.log('data:', data)

    // data.version = appVersion
    // console.log('app version:', appVersion)

    return h.view('completed', {
      pageHeading: 'Search result',
      pageText: 'will appear here',
      details: `You searched for<br><strong>${permitNumber}</strong>`
      // data: data
    })
    // ///////////////////////////
  }
  // handler: async (request, h) => {
  //   // const { answer } = await getQueryData(request)
  //   return h.view('completed', {
  //     pageHeading: 'Search result',
  //     // details: `You chose<br><strong>${answer}</strong>`
  //     details: ''
  //   })
  // }
}
