const appInsights = require('applicationinsights')
const config = require('../config/config')

class AppInsightsService {
  initialise () {
    appInsights
      .setup(config.appInsightsInstrumentationKey)
      .start()

    this.isInitialised = true
  }

  trackEvent (args) {
    if (!this.isInitialised) {
      this.initialise()
    }
    appInsights.defaultClient.trackEvent(args)
  }

  trackMetric (args) {
    if (!this.isInitialised) {
      this.initialise()
    }
    appInsights.defaultClient.trackMetric(args)
  }
}

module.exports = new AppInsightsService()
