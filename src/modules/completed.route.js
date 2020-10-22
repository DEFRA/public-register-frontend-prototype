'use strict'

const { logger } = require('defra-logging-facade')
const { getQueryData } = require('@envage/hapi-govuk-journey-map')

// These imports will be needed when developing Feature 12215 (Monitor performance of service) and
// Story 7158 (View permit documents, view permit page)
// const MiddlewareService = require('../services/middleware.service')
// const AppInsightsService = require('../services/app-insights.service')
// const appInsightsService = new AppInsightsService()


module.exports = {
  method: 'GET',
  handler: async (request, h) => {
    // This will be used in Feature 12215 (Monitor performance of service)
    // AppInsights & ePR POC //////////////////
    // appInsightsService.trackEvent({ name: 'Carrying out search page loaded', properties: { runningAt: 'whatever' } })
    // appInsightsService.trackMetric({ name: 'DEFRA custom metric', value: 333 })
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
    logger.info(`Carrying out search for permit number: ${permitNumber}`)

    // This will be used in Story 7158 (View permit documents, view permit page)
    // Middleware Integration
    // const middlewareService = new MiddlewareService()
    // const permitData = await middlewareService.search(permitNumber)

    const permitData = {}
    return h.view('completed', {
      pageHeading: 'Search result',
      pageText: 'will appear here',
      details: `You searched for<br><strong>${permitNumber}</strong>`,
      permitNumber,
      permitData
    })
  }
}
