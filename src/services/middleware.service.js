'use strict'

const fetch = require('node-fetch')

const { logger } = require('defra-logging-facade')
const config = require('../config/config')

const downloadUrl = `https://${config.middlewareEndpoint}/v1/Download`
const searchUrl = `https://${config.middlewareEndpoint}/v2/search`

const headers = {
  'Ocp-Apim-Subscription-Key': config.ocpKey
}

class MiddlewareService {
  async download (documentId) {
    const options = {
      method: 'GET',
      headers
    }
    const url = `${downloadUrl}?downloadURL=${documentId}`

    logger.info(`Fetching URL: ${url}`)
    const response = await fetch(url, options)

    if (response.status !== 200) {
      throw new Error(`Document ${documentId} not found`)
    }

    return response.body
  }

  async checkPermitExists (permitNumber) {
    const options = {
      method: 'HEAD',
      headers
    }
    const url = `${searchUrl}?query=${permitNumber}`

    logger.info(`Fetching URL: ${url}`)

    const response = await fetch(url, options)
    return response.status === 200
  }

  async search (permitNumber, method = 'GET') {
    const options = {
      method: 'GET',
      headers
    }
    const url = `${searchUrl}?query=${permitNumber}`

    logger.info(`Fetching URL: ${url}`)

    const response = await fetch(url, options)
    const json = await response.json()

    return json
  }
}

module.exports = MiddlewareService
