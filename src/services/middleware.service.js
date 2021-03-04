'use strict'

const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid')

const { logger } = require('defra-logging-facade')
const config = require('../config/config')

const DOWNLOAD_URL = `https://${config.middlewareEndpoint}/v1/Download`
const SEARCH_URL = `https://${config.middlewareEndpoint}/v1/search`

const OCP_KEY = 'Ocp-Apim-Subscription-Key'
const CORRELATION_ID_KEY = 'X-Correlation-Id'
const REGISTER_METADATA_FIELD = 'RegulatedActivityClass'

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

  async checkPermitExists (permitNumber, register) {
    const correlationId = uuidv4()
    const options = {
      method: 'HEAD',
      headers: Object.assign(headers, { [CORRELATION_ID_KEY]: correlationId })
    }

    const url = `${SEARCH_URL}?query=${permitNumber}&filter=${REGISTER_METADATA_FIELD} eq '${register}' and PermitNumber eq '${permitNumber}'`

    logger.info(`Checking permit exists - fetching URL: [${url}] Correlation ID: [${correlationId}]`)

    const response = await fetch(url, options)

    return response.status === 200
  }

  async search (params, useAlternativePermitNumber = false, useAutoRetry = true, includeAllDocumentTypes = false) {
    const correlationId = uuidv4()
    const options = {
      method: 'GET',
      headers: Object.assign(headers, { [CORRELATION_ID_KEY]: correlationId })
    }

    const orderBy = `UploadDate ${params.sort === 'newest' ? 'desc' : 'asc'}`

    let uploadDateFilters = ''
    if (params.uploadedAfter.timestamp) {
      uploadDateFilters += ` and UploadDate ge ${params.uploadedAfter.timestamp}`
    }
    if (params.uploadedBefore.timestamp) {
      uploadDateFilters += ` and UploadDate le ${params.uploadedBefore.timestamp}`
    }

    let activityGroupingFilter = ''
    if (!includeAllDocumentTypes && params.documentTypes && params.documentTypes.length) {
      activityGroupingFilter += ' and ('

      for (const documentType of params.documentTypes) {
        activityGroupingFilter += `ActivityGrouping eq '${documentType}' or `
      }

      activityGroupingFilter = activityGroupingFilter.replace(/ or $/, ')')
    }

    const permitNumberToSearch = !useAlternativePermitNumber
      ? params.sanitisedPermitNumber
      : params.sanitisedAlternativePermitNumber
    let url = `${SEARCH_URL}?query=${permitNumberToSearch}&filter=${REGISTER_METADATA_FIELD} eq '${params.register}' and PermitNumber eq '${permitNumberToSearch}'${uploadDateFilters}${activityGroupingFilter}&pageNumber=${params.page}&pageSize=${params.pageSize}&orderby=${orderBy}`

    logger.info(`Searching for permit - fetching URL: [${url}] Correlation ID: [${correlationId}]`)

    let response = await fetch(url, options)
    let json = await response.json()

    if (useAutoRetry && json.responseCode === 404 && params.page > 1) {
      // If our filter criteria have resulted in fewer results than our current page number
      // then set the current page back to beginning and run the query again
      params.page = 1
      url = `${SEARCH_URL}?query=${permitNumberToSearch}&filter=${REGISTER_METADATA_FIELD} eq '${params.register}' and PermitNumber eq '${permitNumberToSearch}'${uploadDateFilters}${activityGroupingFilter}&pageNumber=${params.page}&pageSize=${params.pageSize}&orderby=${orderBy}`

      logger.info(`Searching for permit - fetching URL: [${url}] Correlation ID: [${correlationId}]`)

      response = await fetch(url, options)
      json = await response.json()
    }

    return json
  }

  async searchIncludingAllDocumentTypes (params, useAlternativePermitNumber = false) {
    return this.search(params, useAlternativePermitNumber, false, true)
  }
}

module.exports = MiddlewareService
