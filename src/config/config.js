'use strict'

// Load application configuration using Dotenv
// (see https://www.npmjs.com/package/dotenv)
require('dotenv').config()

const config = module.exports = {}

config.environment = process.env.NODE_ENV || 'PRODUCTION'

config.applicationUrl = process.env.APPLICATION_URL || '0.0.0.0'

config.port = process.env.PORT || 3000

config.appInsightsInstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 'THE_APP_INSIGHTS_KEY'

config.cookiePassword = process.env.COOKIE_PASSWORD

config.ocpKey = process.env.OCP_KEY
