'use strict'

const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid')

const { logger } = require('defra-logging-facade')
const config = require('../config/config')

const DOWNLOAD_URL = `https://${config.middlewareEndpoint}/v1/Download`
const SEARCH_URL = `https://${config.middlewareEndpoint}/v1/search`

const OCP_KEY = 'Ocp-Apim-Subscription-Key'
const CORRELATION_ID_KEY = 'X-Correlation-Id'

const headers = {
  [OCP_KEY]: config.ocpKey
}

class MiddlewareService {
  async download (documentId) {
    const correlationId = uuidv4()
    const options = {
      method: 'GET',
      headers: Object.assign(headers, { [CORRELATION_ID_KEY]: correlationId })
    }
    const url = `${DOWNLOAD_URL}?downloadURL=${documentId}`

    logger.info(`Fetching URL: ${url} - Correlation ID: ${correlationId}`)
    const response = await fetch(url, options)

    if (response.status !== 200) {
      throw new Error(`Document ID: [${documentId}] not found, correlation ID: [${correlationId}]`)
    }

    return response.body
  }

  async checkPermitExists (permitNumber) {
    const correlationId = uuidv4()
    const options = {
      method: 'HEAD',
      headers: Object.assign(headers, { [CORRELATION_ID_KEY]: correlationId })
    }
    const url = `${SEARCH_URL}?query=${permitNumber}&filter=PermitNumber eq '${permitNumber}'`

    logger.info(`Checking permit exists - fetching URL: [${url}] Correlation ID: [${correlationId}]`)

    const response = await fetch(url, options)

    return response.status === 200
  }

  async search (permitNumber, page, pageSize, sort, uploadedAfter, uploadedBefore, activityGroupings = []) {
    const correlationId = uuidv4()
    const options = {
      method: 'GET',
      headers: Object.assign(headers, { [CORRELATION_ID_KEY]: correlationId })
    }

    const orderBy = `UploadDate ${sort === 'newest' ? 'desc' : 'asc'}`

    let uploadDateFilters = ''
    if (uploadedAfter) {
      uploadDateFilters += ` and UploadDate ge ${uploadedAfter}`
    }
    if (uploadedBefore) {
      uploadDateFilters += ` and UploadDate le ${uploadedBefore}`
    }

    let activityGroupingFilter = ''
    if (activityGroupings.length) {
      activityGroupingFilter += ' and ('

      for (const activityGrouping of activityGroupings) {
        activityGroupingFilter += `ActivityGrouping eq '${activityGrouping}' or `
      }

      activityGroupingFilter = activityGroupingFilter.replace(/ or $/, ')')
    }

    const url = `${SEARCH_URL}?query=${permitNumber}&filter=PermitNumber eq '${permitNumber}'${uploadDateFilters}${activityGroupingFilter}&pageNumber=${page}&pageSize=${pageSize}&orderby=${orderBy}`

    logger.info(`Searching for permit - fetching URL: [${url}] Correlation ID: [${correlationId}]`)

    const response = await fetch(url, options)
    const json = await response.json()

    return json
  }
}

module.exports = MiddlewareService
