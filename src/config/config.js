'use strict'

// Load application configuration using Dotenv
// (see https://www.npmjs.com/package/dotenv)
require('dotenv').config()

const getBoolean = value => {
  return String(value).toLowerCase() === 'true'
}

const config = (module.exports = {})

config.environment = process.env.NODE_ENV || 'PRODUCTION'

config.applicationUrl = process.env.APPLICATION_URL || '0.0.0.0'

config.port = process.env.PORT || 3000

config.appInsightsEnabled = getBoolean(process.env.APPINSIGHTS_ENABLED || true)

config.appInsightsInstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 'THE_APP_INSIGHTS_KEY'

config.eprUrl = process.env.EPR_URL || 'THE_EPR_URL'

config.middlewareEndpoint = process.env.MIDDLEWARE_ENDPOINT || 'the_middleware_endpoint'

config.govNotifyKey = process.env.GOV_NOTIFY_KEY || 'THE_GOV_NOTIFY_KEY'
config.govNotifyRateLimit = process.env.GOV_NOTIFY_RATE_LIMIT || 400

config.ocpKey = process.env.OCP_KEY || 'THE_OCP_KEY'

config.pageSize = parseInt(process.env.PAGE_SIZE) || 20

config.ncccEmail = process.env.NCCC_EMAIL || 'NCCC_EMAIL'

config.ncccEmailTemplateId = process.env.NCCC_EMAIL_TEMPLATE_ID || 'NCCC_EMAIL_TEMPLATE_ID'

config.ncccEmailSearchModeTemplateId =
  process.env.NCCC_EMAIL_SEARCH_MODE_TEMPLATE_ID || 'NCCC_EMAIL_SEARCH_MODE_TEMPLATE_ID'

config.customerEmailTemplateId = process.env.CUSTOMER_EMAIL_TEMPLATE_ID || 'CUSTOMER_EMAIL_TEMPLATE_ID'

config.customerEmailSearchModeTemplateId =
  process.env.CUSTOMER_EMAIL_SEARCH_MODE_TEMPLATE_ID || 'CUSTOMER_EMAIL_SEARCH_MODE_TEMPLATE_ID'

config.informationRequestTimescale = parseInt(process.env.INFORMATION_REQUEST_TIMESCALE) || 20

config.useBasicAuth = getBoolean(process.env.USE_BASIC_AUTH || false)
config.basicAuthPassword = process.env.BASIC_AUTH_PASSWORD
