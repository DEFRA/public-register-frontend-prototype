'use strict'

// Load application configuration using Dotenv
// (see https://www.npmjs.com/package/dotenv)
require('dotenv').config()

const config = (module.exports = {})

config.environment = process.env.NODE_ENV || 'PRODUCTION'

config.applicationUrl = process.env.APPLICATION_URL || '0.0.0.0'

config.port = process.env.PORT || 3000

config.appInsightsInstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 'THE_APP_INSIGHTS_KEY'

config.cookiePassword = process.env.COOKIE_PASSWORD || 'THE_COOKIE_PASSWORD'

config.eprUrl = process.env.EPR_URL || 'THE_EPR_URL'

config.middlewareEndpoint = process.env.MIDDLEWARE_ENDPOINT || 'the_middleware_endpoint'

config.govNotifyKey = process.env.GOV_NOTIFY_KEY || 'THE_GOV_NOTIFY_KEY'

config.ocpKey = process.env.OCP_KEY || 'THE_OCP_KEY'

config.pageSize = parseInt(process.env.PAGE_SIZE) || 20

config.ncccEmailTemplateId = process.env.NCCC_EMAIL_TEMPLATE_ID || 'NCCC_EMAIL_TEMPLATE_ID'
config.customerEmailTemplateId = process.env.CUSTOMER_EMAIL_TEMPLATE_ID || 'CUSTOMER_EMAIL_TEMPLATE_ID'
config.documentRequestTimescale = parseInt(process.env.DOCUMENT_REQUEST_TIMESCALE) || 20
