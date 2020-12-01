'use strict'

const fetch = require('node-fetch')

const { logger } = require('defra-logging-facade')
const config = require('../config/config')

const downloadUrl = `https://${config.middlewareEndpoint}/v1/Download`
const searchUrl = `https://${config.middlewareEndpoint}/v2/search`

const options = {
  method: 'GET',
  headers: {
    'Ocp-Apim-Subscription-Key': config.ocpKey
  }
}

class MiddlewareService {
  async download (documentId) {
    const url = `${downloadUrl}?downloadURL=${documentId}`

    logger.info(`Fetching URL: ${url}`)
    const response = await fetch(url, options)

    if (response.status !== 200) {
      throw new Error(`Document ${documentId} not found`)
    }

    return response.body
  }

  async search (permitNumber) {
    const url = `${searchUrl}?query=${permitNumber}`

    logger.info(`Fetching URL: ${url}`)

    const response = await fetch(url, options)
    const json = await response.json()

    return json
  }
}

module.exports = MiddlewareService
