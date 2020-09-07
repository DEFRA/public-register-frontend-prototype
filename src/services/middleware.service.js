'use strict'

const fetch = require('node-fetch')
const config = require('../config/config')

const url = 'https://api.mantaqconsulting.co.uk/api/search'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

class MiddlewareService {
  async _post (url, id) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': config.ocpKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: id })
      }

      const response = await fetch(url, options)
      const json = await response.json()

      return json
    } catch (error) {
      console.error(error)
    }
  }

  async search (id) {
    try {
      return this._post(`${url}`, id)
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = MiddlewareService
