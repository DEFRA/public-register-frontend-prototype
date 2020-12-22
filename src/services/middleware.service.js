'use strict'

const fetch = require('node-fetch')

const { logger } = require('defra-logging-facade')
const config = require('../config/config')

const DOWNLOAD_URL = `https://${config.middlewareEndpoint}/v1/Download`
const SEARCH_URL = `https://${config.middlewareEndpoint}/v1/search`

const headers = {
  'Ocp-Apim-Subscription-Key': config.ocpKey
}

class MiddlewareService {
  async download (documentId) {
    const options = {
      method: 'GET',
      headers
    }
    const url = `${DOWNLOAD_URL}?downloadURL=${documentId}`

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
    const url = `${SEARCH_URL}?query=${permitNumber}&filter=PermitNumber eq '${permitNumber}'`

    logger.info(`Fetching URL: ${url}`)

    const response = await fetch(url, options)
    return response.status === 200
  }

  async search (permitNumber, page, pageSize, sort, uploadedAfter, uploadedBefore, activityGroupings = []) {
    const options = {
      method: 'GET',
      headers
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
      activityGroupings.forEach(activityGrouping => {
        activityGroupingFilter += `ActivityGrouping eq '${activityGrouping}' or `
      })
      activityGroupingFilter = activityGroupingFilter.replace(/ or $/, ')')
    }

    const url = `${SEARCH_URL}?query=${permitNumber}&filter=PermitNumber eq '${permitNumber}'${uploadDateFilters}${activityGroupingFilter}&pageNumber=${page}&pageSize=${pageSize}&orderby=${orderBy}`

    console.log(url)

    logger.info(`Fetching URL: ${url}`)

    const response = await fetch(url, options)
    const json = await response.json()

    return json
  }
}

module.exports = MiddlewareService
