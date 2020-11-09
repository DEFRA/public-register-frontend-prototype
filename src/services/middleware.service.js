'use strict'

const fetch = require('node-fetch')
const config = require('../config/config')

const downloadUrl = config.middlewareEndpoint + '/Download'
const searchUrl = config.middlewareEndpoint + '/Search'

class MiddlewareService {
  async _get (url) {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': config.ocpKey,
          'Content-Type': 'application/json'
        }
      }

      const response = await fetch(url, options)
      const json = await response.json()

      return json
    } catch (error) {
      console.error(error)
    }
  }

  async download (documentId) {
    try {
      return this._get(`${downloadUrl}/${documentId}`)
    } catch (error) {
      console.error(error)
    }
  }

  async search (permitNumber) {
    try {
      return this._get(`${searchUrl}?permitNumber=${permitNumber}`)
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = MiddlewareService
