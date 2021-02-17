'use strict'

const applicationinsights = require('applicationinsights')
const { logger } = require('defra-logging-facade')
const config = require('../config/config')

class AppInsightsService {
  initialise () {
    applicationinsights.setup(config.appInsightsInstrumentationKey).start()

    this.isInitialised = true
  }

  trackEvent (args) {
    if (!this.isInitialised) {
      this.initialise()
    }
    if (config.appInsightsEnabled) {
      logger.info(`Logging AppInsights event: [${args.name}]`)
      applicationinsights.defaultClient.trackEvent(args)
    } else {
      logger.info(`Logging AppInsights is disabled: [${args.name}]`)
    }
  }
}

module.exports = AppInsightsService
