'use strict'

const applicationinsights = require('applicationinsights')
const config = require('../config/config')

class AppInsightsService {
  initialise () {
    applicationinsights
      .setup(config.appInsightsInstrumentationKey)
      .start()

    this.isInitialised = true
  }

  trackEvent (args) {
    if (!this.isInitialised) {
      this.initialise()
    }
    applicationinsights.defaultClient.trackEvent(args)
  }

  trackMetric (args) {
    if (!this.isInitialised) {
      this.initialise()
    }
    applicationinsights.defaultClient.trackMetric(args)
  }
}

module.exports = AppInsightsService
