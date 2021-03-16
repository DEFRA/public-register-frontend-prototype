'use strict'

const fetch = require('node-fetch')
const { v4: uuidv4 } = require('uuid')

const { logger } = require('defra-logging-facade')
const config = require('../config/config')

const downloadUrl = `https://${config.middlewareEndpoint}/v1/Download`
const searchUrl = `https://${config.middlewareEndpoint}/v1/search`

const ocpKey = 'Ocp-Apim-Subscription-Key'
const correlationIdKey = 'X-Correlation-Id'
const registerMetadataField = 'RegulatedActivityClass'

const headers = {
  [ocpKey]: config.ocpKey
}

const searchFields = ['DocTitle', 'CustomerOperatorName', 'SiteName', 'FacilityAddressPostcode']

class MiddlewareService {
  async download (documentId) {
    const correlationId = uuidv4()
    const options = {
      method: 'GET',
      headers: Object.assign(headers, { [correlationIdKey]: correlationId })
    }
    const url = `${downloadUrl}?downloadURL=${documentId}`

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
      headers: Object.assign(headers, { [correlationIdKey]: correlationId })
    }

    const url = `${searchUrl}?query=${permitNumber}&filter=${registerMetadataField} eq '${register}' and PermitNumber eq '${permitNumber}'`

    logger.info(`Checking permit exists - fetching URL: [${url}] Correlation ID: [${correlationId}]`)

    const response = await fetch(url, options)

    return response.status === 200
  }

  async search (params, useAlternativePermitNumber = false, useAutoRetry = true, includeAllDocumentTypes = false) {
    const correlationId = uuidv4()
    const options = {
      method: 'GET',
      headers: Object.assign(headers, { [correlationIdKey]: correlationId })
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
    let url = `${searchUrl}?query=${permitNumberToSearch}&filter=${registerMetadataField} eq '${params.register}' and PermitNumber eq '${permitNumberToSearch}'${uploadDateFilters}${activityGroupingFilter}&pageNumber=${params.page}&pageSize=${params.pageSize}&orderby=${orderBy}`

    logger.info(`Searching for permit - fetching URL: [${url}] Correlation ID: [${correlationId}]`)

    let response = await fetch(url, options)
    let json = await response.json()

    if (useAutoRetry && json.statusCode === 404 && params.page > 1) {
      // If our filter criteria have resulted in fewer results than our current page number
      // then set the current page back to beginning and run the query again
      params.page = 1
      url = `${searchUrl}?query=${permitNumberToSearch}&filter=${registerMetadataField} eq '${params.register}' and PermitNumber eq '${permitNumberToSearch}'${uploadDateFilters}${activityGroupingFilter}&pageNumber=${params.page}&pageSize=${params.pageSize}&orderby=${orderBy}`

      logger.info(`Searching for permit - fetching URL: [${url}] Correlation ID: [${correlationId}]`)

      response = await fetch(url, options)
      json = await response.json()
    }

    return json
  }

  async searchIncludingAllDocumentTypes (params, useAlternativePermitNumber = false) {
    return this.search(params, useAlternativePermitNumber, false, true)
  }

  async searchAcrossPermits (params, includeAllDocumentTypes = false) {
    const correlationId = uuidv4()
    const options = {
      method: 'GET',
      headers: Object.assign(headers, { [correlationIdKey]: correlationId })
    }

    const orderBy = `UploadDate ${params.sort === 'newest' ? 'desc' : 'asc'}`

    const filters = []
    if (params.uploadedAfter.timestamp) {
      filters.push(`UploadDate ge ${params.uploadedAfter.timestamp}`)
    }
    if (params.uploadedBefore.timestamp) {
      filters.push(`UploadDate le ${params.uploadedBefore.timestamp}`)
    }

    if (!includeAllDocumentTypes && params.documentTypes && params.documentTypes.length) {
      let activityGroupingFilter = '('

      for (const documentType of params.documentTypes) {
        activityGroupingFilter += `ActivityGrouping eq '${documentType}' or `
      }

      activityGroupingFilter = activityGroupingFilter.replace(/ or $/, ')')
      filters.push(activityGroupingFilter)
    }

    if (params.documentSearch && params.documentSearch.length) {
      const searchTerms = params.documentSearch.split(/(\s+)/).filter(term => term.trim() !== '')

      let searchFilter = '('
      for (const searchTerm of searchTerms) {
        for (const field of searchFields) {
          searchFilter += `search.ismatchscoring('${searchTerm}', '${field}') or `
        }
        searchFilter = searchFilter.replace(/ or $/, ') and (')
      }

      searchFilter = searchFilter.replace(/ and \($/, '')
      filters.push(searchFilter)
    }

    const queryTerm = 'query=*&'

    let concatenatedFilters = filters.join(' and ')
    if (concatenatedFilters.length) {
      concatenatedFilters = `filter=${concatenatedFilters}&`
    }

    let url = `${searchUrl}?${queryTerm}${concatenatedFilters}pageNumber=${params.page}&pageSize=${params.pageSize}&orderby=${orderBy}`

    logger.info(`Searching for documents - fetching URL: [${url}] Correlation ID: [${correlationId}]`)

    let response = await fetch(url, options)
    let json = await response.json()

    if (json.statusCode === 404 && params.page > 1) {
      // If our filter criteria have resulted in fewer results than our current page number
      // then set the current page back to beginning and run the query again
      params.page = 1
      url = `${searchUrl}?${queryTerm}${concatenatedFilters}pageNumber=${params.page}&pageSize=${params.pageSize}&orderby=${orderBy}`

      logger.info(`Searching for permit - fetching URL: [${url}] Correlation ID: [${correlationId}]`)

      response = await fetch(url, options)
      json = await response.json()
    }

    return json
  }
}

module.exports = MiddlewareService
