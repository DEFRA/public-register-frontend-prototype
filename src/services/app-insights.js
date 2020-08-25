const appInsights = require('applicationinsights')
const config = require('../config/config')

class AppInsightsService {
  constructor () {
    console.log('created AppInsightsService')

    appInsights
      .setup(config.appInsightsInstrumentationKey)
      .start()
  }

  get defaultClient () {
    return appInsights.defaultClient
  }
}

module.exports = new AppInsightsService()
