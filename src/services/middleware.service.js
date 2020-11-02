'use strict'

const fetch = require('node-fetch')
const config = require('../config/config')

const downloadUrl = config.middlewareEndpoint + '/Download'
// TODO reinstate this once the endpoint is available
// const searchUrl = config.middlewareEndpoint + '/Search'

// TODO remove this once the endpoint is available
const mockData = require('../../test/data/permit-data')

// TODO review the need for this
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

class MiddlewareService {
  // TODO remove this once GET is confirmed
  // async _post (url, id) {
  //   try {
  //     const options = {
  //       method: 'POST',
  //       headers: {
  //         'Ocp-Apim-Subscription-Key': config.ocpKey,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ name: id })
  //     }

  //     const response = await fetch(url, options)
  //     const json = await response.json()

  //     return json
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  async _get (url, id) {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': config.ocpKey,
          'Content-Type': 'application/json'
        }
        // TODO remove this once GET is confirmed
        // body: JSON.stringify({ name: id })
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
    permitNumber = 'ABC123/45'
    try {
      // TODO reinstate this once endpoint available
      // return this._get(`${searchUrl}`, permitNumber)

      return mockData
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = MiddlewareService
