'use strict'

const fetch = require('node-fetch')
// const fs = require('fs')
// const util = require('util')
// const streamPipeline = util.promisify(require('stream').pipeline)

const { logger } = require('defra-logging-facade')
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

      logger.info(`Fetching URL: ${url}`)

      const response = await fetch(url, options)
      const json = await response.json()

      return json
    } catch (error) {
      console.error(error)
    }
  }

  async _getFile (url) {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': config.ocpKey,
          'Content-Type': 'application/octet-stream'
        }
      }

      logger.info(`Fetching URL: ${url}`)

      const response = await fetch(url, options)
      console.log(response)
      console.log('response OK?:', response.ok)

      // console.log(await response.buffer())

      // const buffer = await response.buffer()

      // return buffer

      return response

      // if (response.ok) {
      //   return streamPipeline(response.body, fs.createWriteStream('./octocat.png'))
      // }

      // throw new Error(`unexpected response ${response.statusText}`)
    } catch (error) {
      console.error(error)
    }
  }

  async download (documentId) {
    try {
      return this._getFile(`${downloadUrl}?downloadURL=${documentId}`)
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
