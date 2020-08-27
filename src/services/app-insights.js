const appInsights = require('applicationinsights')
const config = require('../config/config')

class AppInsightsService {
  constructor () {
    appInsights
      .setup(config.appInsightsInstrumentationKey)
      .start()
  }

  get defaultClient () {
    return appInsights.defaultClient
  }
}

module.exports = new AppInsightsService()
