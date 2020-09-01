// const appInsights = require('applicationinsights')
// const config = require('../config/config')

class AppInsightsService {
  // constructor () {
  //   appInsights
  //     .setup(config.appInsightsInstrumentationKey)
  //     .start()
  // }

  trackEvent (args) {
    // appInsights.defaultClient.trackEvent(args)
  }

  trackMetric (args) {
    // appInsights.defaultClient.trackMetric(args)
  }

  //   get defaultClient () {
  //     console.log('****** getting defauilt client')
  //     return appInsights.defaultClient
  //   }
}

module.exports = new AppInsightsService()
