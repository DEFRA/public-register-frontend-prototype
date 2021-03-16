'use strict'

const { logger } = require('defra-logging-facade')

const config = require('../config/config')
const { BOOLEAN_TRUE, Views, Registers } = require('../constants')
const { formatDate, formatExtension, formatFileSize, sanitisePermitNumber, validateDate } = require('../utils/general')

const MiddlewareService = require('../services/middleware.service')

const AppInsightsService = require('../services/app-insights.service')

const DATE_ERROR_MESSAGE = 'Enter a real date'

const TagLabels = {
  DOCUMENT_TYPES: 'Document types',
  UPLOADED_AFTER: 'Uploaded after',
  UPLOADED_BEFORE: 'Uploaded before',
  UPLOADED_BETWEEN: 'Uploaded between'
}

const EPR_REFERER_REFERENCE = 'EPR'

module.exports = [
  {
    method: 'GET',
    handler: async (request, h) => {
      const params = _getParams(request)

      let permitData
      if (params.isSearchMode) {
        permitData = await _searchDocmentMetadata(params)
      } else {
        permitData = await _getPermitData(params)
      }

      if (!params.isSearchMode) {
        if (permitData.statusCode === 404) {
          logger.info(`Permit number: [${params.permitNumber}] not found for register: [${params.register}]`)

          if (params.isEprReferral) {
            _sendAppInsight({
              name: 'KPI 4 - Referral from ePR has failed to match a permit',
              properties: {
                register: params.register,
                permitNumber: params.permitNumber,
                sanitisedPermitNumber: params.sanitisedPermitNumber,
                sanitisedAlternativePermitNumber: params.sanitisedAlternativePermitNumber,
                licenceNumber: params.licenceNumber ? params.licenceNumber : 'Not specified',
                permissionNumber: params.permissionNumber ? params.permissionNumber : 'Not specified'
              }
            })
          }

          return h.redirect(
            `/${Views.PERMIT_NOT_FOUND.route}?permitNumber=${encodeURIComponent(
              params.permitNumber
            )}&register=${encodeURIComponent(params.register)}`
          )
        }
      }

      const context = _getContext(request, permitData, params)
      _setTags(context, params)

      if (!params.isSearchMode) {
        if (!params.isEprReferral) {
          _sendAppInsight({
            name: 'KPI 1 - User-entered permit number has successfully matched a permit',
            properties: {
              permitNumber: params.permitNumber,
              sanitisedPermitNumber: params.sanitisedPermitNumber,
              register: params.register
            }
          })
        } else {
          _sendAppInsight({
            name: 'KPI 2 - Referral from ePR has successfully matched a permit',
            properties: {
              register: params.register,
              permitNumber: params.permitNumber,
              sanitisedPermitNumber: params.sanitisedPermitNumber,
              sanitisedAlternativePermitNumber: params.sanitisedAlternativePermitNumber,
              licenceNumber: params.licenceNumber ? params.licenceNumber : 'Not specified',
              permissionNumber: params.permissionNumber ? params.permissionNumber : 'Not specified'
            }
          })
        }
      }

      return h.view(Views.VIEW_PERMIT_DOCUMENTS.route, context)
    }
  },
  {
    method: 'POST',
    handler: async (request, h) => {
      const params = _getParams(request)

      let permitData
      if (params.isSearchMode) {
        permitData = await _searchDocmentMetadata(params)
      } else {
        permitData = await _getPermitData(params)
      }

      const context = _getContext(request, permitData, params)
      _setTags(context, params)

      return h.view(Views.VIEW_PERMIT_DOCUMENTS.route, context)
    }
  }
]

const _getParams = request => {
  const params = {}
  const DOCUMENT_SEARCH_EXPANDER_ID = 'document-search-expander-expanded'
  const DOCUMENT_TYPE_EXPANDER_ID = 'document-type-expander-expanded'
  const UPLOADED_DATE_EXPANDER_ID = 'uploaded-date-expander-expanded'
  const DOCUMENT_SEARCH = 'document-search'
  const UPLOADED_AFTER_ID = 'uploaded-after'
  const UPLOADED_BEFORE_ID = 'uploaded-before'

  if (request.method.toLowerCase() === 'get') {
    // GET
    params.isSearchMode = request.query.pageMode === 'search'
    params.permitNumber = request.query.permitNumber
    params.referer = request.query.Referer
    params.register = request.query.register
    params.licenceNumber = request.query.licenceNumber
    params.permissionNumber = request.query.permissionNumber
    params.page = 1
    params.sort = 'newest'

    params.documentSearch = ''

    params.documentSearchExpanded = true
    params.documentTypeExpanded = true
    params.uploadedDateExpanded = false

    params.isEprReferral = (params.referer || '').toUpperCase() === EPR_REFERER_REFERENCE

    if (params.isEprReferral) {
      if (params.register === Registers.WASTE_OPERATIONS || params.register === Registers.END_OF_LIFE_VEHICLES) {
        params.alternatiePermitNumber = params.permitNumber
        params.permitNumber = params.licenceNumber

        if (params.register === Registers.END_OF_LIFE_VEHICLES) {
          params.register = Registers.WASTE_OPERATIONS
        }
      }

      if (params.register === Registers.DISCHARGES_TO_WATER_AND_GROUNDWATER_DISPLAY_VALUE) {
        params.register = Registers.DISCHARGES_TO_WATER_AND_GROUNDWATER
      }
    }
  } else {
    // POST
    params.isSearchMode = request.payload.isSearchMode === BOOLEAN_TRUE
    params.permitNumber = request.payload.permitNumber || ''
    params.referer = request.payload.Referer || ''
    params.register = request.payload.register || ''
    params.page = parseInt(request.payload.page) || 1
    params.sort = request.payload.sort || 'newest'

    params.documentSearch = request.payload[DOCUMENT_SEARCH] || ''
    params.uploadedAfter = request.payload[UPLOADED_AFTER_ID] || ''
    params.uploadedBefore = request.payload[UPLOADED_BEFORE_ID] || ''

    if (request.payload.documentTypes) {
      params.documentTypes = Array.isArray(request.payload.documentTypes)
        ? request.payload.documentTypes
        : [request.payload.documentTypes]
    }

    params.documentSearchExpanded = request.payload[DOCUMENT_SEARCH_EXPANDER_ID] === BOOLEAN_TRUE
    params.documentTypeExpanded = request.payload[DOCUMENT_TYPE_EXPANDER_ID] === BOOLEAN_TRUE
    params.uploadedDateExpanded = request.payload[UPLOADED_DATE_EXPANDER_ID] === BOOLEAN_TRUE

    _processClickedTag(request, params)
  }

  params.uploadedAfter = validateDate(params.uploadedAfter)
  params.uploadedBefore = validateDate(params.uploadedBefore)

  if (Date.parse(params.uploadedAfter.timestamp) > Date.parse(params.uploadedBefore.timestamp)) {
    params.uploadedBefore.timestamp = null
    params.uploadedBefore.isValid = false
    params.uploadedBefore.dateError = '"Uploaded before" must be later than "Uploaded after"'
  }

  params.pageSize = config.pageSize
  params.sanitisedPermitNumber = sanitisePermitNumber(params.register, params.permitNumber)
  if (params.alternatiePermitNumber) {
    params.sanitisedAlternativePermitNumber = sanitisePermitNumber(params.register, params.alternatiePermitNumber)
  }

  return params
}

const _getPermitData = async params => {
  logger.info(`Carrying out search for permit number: [${params.permitNumber}] in register: [${params.register}]`)
  const middlewareService = new MiddlewareService()

  let useAlternativePermitNumber
  let permitData = await middlewareService.search(params)

  if (permitData.statusCode === 404) {
    useAlternativePermitNumber = true
    permitData = await middlewareService.search(params, useAlternativePermitNumber)
  }

  if (permitData.statusCode !== 404) {
    const permitDataAllDocumentTypes = await middlewareService.searchIncludingAllDocumentTypes(
      params,
      useAlternativePermitNumber
    )
    permitData.facets = _getFacets(permitDataAllDocumentTypes.result.facets, params.documentTypes)
  }

  return permitData
}

const _searchDocmentMetadata = async params => {
  let permitData = []

  if (params.documentSearch && params.documentSearch.length) {
    logger.info(`Carrying out search across permits for search terms: [${params.documentSearch}]`)
    const middlewareService = new MiddlewareService()

    permitData = await middlewareService.searchAcrossPermits(params)

    if (permitData.statusCode !== 404) {
      const permitDataAllDocumentTypes = await middlewareService.searchAcrossPermits(params, true)
      permitData.facets = _getFacets(permitDataAllDocumentTypes.result.facets, params.documentTypes)
    }
  }

  return permitData
}

const _getContext = (request, permitData, params) => {
  // Format data for display
  if (permitData && permitData.result && permitData.result.totalCount) {
    for (const item of permitData.result.items) {
      item.document.extensionFormatted = formatExtension(item.document.extension)
      item.document.fileSizeFormatted = formatFileSize(item.document.size)
      item.document.uploadDateFormatted = formatDate(item.document.uploadDate)
    }
  }

  // Save the permit details in case we subsequently filter out all results
  let permitDetails
  if (permitData.result && permitData.result.items) {
    const firstItem = permitData.result.items[0]
    permitDetails = {
      permitNumber: firstItem.permitDetails.permitNumber,
      siteName: firstItem.site.siteName,
      register: firstItem.permitDetails.register,
      address: firstItem.site.address,
      postcode: firstItem.site.postcode
    }
  } else {
    // No data returned so try and get the permit details from the request instead
    if (request.payload) {
      permitDetails = {}
      const cachedPermitFields = ['permitNumber', 'siteName', 'register', 'address', 'postcode']

      for (const field of cachedPermitFields) {
        permitDetails[field] = request.payload[field]
      }
    }
  }

  const viewData = _buildViewData(permitData, params, permitDetails)

  Object.assign(viewData, {
    pageHeading: Views.VIEW_PERMIT_DOCUMENTS.pageHeading,
    id: params.permitNumber,
    permitData
  })

  if (!params.uploadedAfter.isValid) {
    viewData.uploadedAfterErrorMessage = {
      text: DATE_ERROR_MESSAGE
    }
  }

  if (!params.uploadedBefore.isValid) {
    viewData.uploadedBeforeErrorMessage = {
      text: params.uploadedBefore.dateError ? params.uploadedBefore.dateError : DATE_ERROR_MESSAGE
    }
  }

  return viewData
}

const _getFacets = (facets, documentTypes = []) => {
  return Object.entries(facets).map(([key, value]) => {
    return {
      value: key,
      text: `${key} (${value})`,
      checked: documentTypes.includes(key)
    }
  })
}

const _buildViewData = (permitData, params, permitDetails) => {
  const viewData = {
    permitDetails
  }

  viewData.isSearchMode = params.isSearchMode

  if (permitData && permitData.result && permitData.result.totalCount) {
    const lastPage = Math.ceil(permitData.result.totalCount / config.pageSize)
    viewData.page = params.page
    viewData.previousPage = params.page > 0 ? params.page - 1 : null
    viewData.nextPage = params.page < lastPage ? params.page + 1 : null
    viewData.pageCount = lastPage
    viewData.paginationRequired = viewData.pageCount > 1
    viewData.showPaginationSeparator = viewData.previousPage && viewData.nextPage
    viewData.url = `/${Views.VIEW_PERMIT_DOCUMENTS.route}/${permitData.result.items[0].permitDetails.permitNumber}`
  }

  viewData.documentSearch = params.documentSearch
  viewData.sort = params.sort
  viewData.uploadedAfter = params.uploadedAfter
  viewData.uploadedBefore = params.uploadedBefore
  viewData.documentSearchExpanded = params.documentSearchExpanded
  viewData.documentTypeExpanded = params.documentTypeExpanded
  viewData.uploadedDateExpanded = params.uploadedDateExpanded

  viewData.contactLink = `/${Views.CONTACT.route}?searchMode=${viewData.isSearchMode}`
  if (!viewData.isSearchMode) {
    viewData.contactLink = `${viewData.contactLink}&permitNumber=${permitDetails.permitNumber}&site=${permitDetails.siteName}&register=${permitDetails.register}&address=${permitDetails.address}&postcode=${permitDetails.postcode}`
  }

  return viewData
}

const _setTags = (viewData, params) => {
  if (params.documentTypes && params.documentTypes.length) {
    viewData.tagRows = []

    const tagRow = { label: TagLabels.DOCUMENT_TYPES, tags: [], separator: 'or' }
    for (const documentType of params.documentTypes) {
      tagRow.tags.push(documentType)
    }
    viewData.tagRows.push(tagRow)
  }

  if (
    params.uploadedAfter.formattedDateDmy &&
    params.uploadedBefore.formattedDateDmy &&
    params.uploadedBefore.isValid
  ) {
    if (!viewData.tagRows) {
      viewData.tagRows = []
    }
    viewData.tagRows.push({
      label: 'Uploaded between',
      tags: [params.uploadedAfter.formattedDateDmy, params.uploadedBefore.formattedDateDmy],
      separator: 'and'
    })
  } else {
    if (params.uploadedAfter.formattedDateDmy) {
      if (!viewData.tagRows) {
        viewData.tagRows = []
      }
      viewData.tagRows.push({ label: TagLabels.UPLOADED_AFTER, tags: [params.uploadedAfter.formattedDateDmy] })
    }

    if (params.uploadedBefore.formattedDateDmy && params.uploadedBefore.isValid) {
      if (!viewData.tagRows) {
        viewData.tagRows = []
      }
      viewData.tagRows.push({ label: TagLabels.UPLOADED_BEFORE, tags: [params.uploadedBefore.formattedDateDmy] })
    }
  }
}

const _processClickedTag = (request, params) => {
  if (request.payload.clickedRow) {
    switch (request.payload.clickedRow) {
      case TagLabels.UPLOADED_AFTER:
        params.uploadedAfter = null
        break
      case TagLabels.UPLOADED_BEFORE:
        params.uploadedBefore = null
        break
      case TagLabels.UPLOADED_BETWEEN:
        parseInt(request.payload.clickedItemIndex) === 1
          ? (params.uploadedAfter = null)
          : (params.uploadedBefore = null)
        break
      case TagLabels.DOCUMENT_TYPES:
        _removeDocumentType(request, params)
    }
  }
}

const _removeDocumentType = (request, params) => {
  if (params.documentTypes && params.documentTypes.length) {
    const index = params.documentTypes.indexOf(request.payload.clickedItem)
    if (index > -1) {
      params.documentTypes.splice(index, 1)
    }
  }
}

const _sendAppInsight = event => {
  const appInsightsService = new AppInsightsService()
  appInsightsService.trackEvent(event)
}
