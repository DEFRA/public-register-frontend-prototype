'use strict'

const Hoek = require('hoek')
const { getQueryData } = require('@envage/hapi-govuk-journey-map')
const { logger } = require('defra-logging-facade')

const { Views } = require('../constants')
const { formatDate, formatFileSize } = require('../utils/general')
const MiddlewareService = require('../services/middleware.service')

// These imports will be needed when developing Feature 12215 (Monitor performance of service) and
// Story 7158 (View permit documents, view permit page)
// const AppInsightsService = require('../services/app-insights.service')
// const appInsightsService = new AppInsightsService()

module.exports = {
  method: 'GET',
  handler: async (request, h) => {
    let id
    if (request.params && request.params.id) {
      id = request.params.id
    } else {
      const { permitNumber } = await getQueryData(request)
      id = permitNumber
    }

    id = Hoek.escapeHtml(id)

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

    logger.info(`Carrying out search for permit number: ${id}`)

    const middlewareService = new MiddlewareService()

    const permitData = await middlewareService.search(id)

    if (permitData.statusCode === 404) {
      logger.info(`Permit number ${id} not found`)
    }

    if (permitData && permitData.result && permitData.result.items && permitData.result.items.length) {
      permitData.result.items.forEach((item) => {
        // Document file size is initially in bytes so format as KB or MB for display
        item.document.fileSizeFormatted = formatFileSize(item.document.size)
        item.document.uploadDateFormatted = formatDate(item.document.uploadDate)
      })
    }

    return h.view(Views.VIEW_PERMIT_DETAILS.route, {
      pageHeading: Views.VIEW_PERMIT_DETAILS.pageHeading,
      id,
      permitData
    })
  }
}
