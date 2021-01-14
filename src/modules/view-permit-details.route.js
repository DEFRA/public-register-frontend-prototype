'use strict'

const Hoek = require('@hapi/hoek')
const { logger } = require('defra-logging-facade')

const config = require('../config/config')
const { Views } = require('../constants')
const { formatDate, formatExtension, formatFileSize, validateDate } = require('../utils/general')
const MiddlewareService = require('../services/middleware.service')

// These imports will be needed when developing Feature 12215 (Monitor performance of service) and
// Story 7158 (View permit documents, view permit page)
// const AppInsightsService = require('../services/app-insights.service')
// const appInsightsService = new AppInsightsService()

// This will be used in Feature 12215 (Monitor performance of service)
// AppInsights & ePR POC //////////////////
// appInsightsService.trackEvent({ name: 'Carrying out search page loaded', properties: { runningAt: 'whatever' } })
// appInsightsService.trackMetric({ name: 'DEFRA custom metric', value: 333 })
// Generate dummy result count to demonstrate use of event tracking in Azure Application Insights
// const randomNumber = Math.random()
// const isSuccessfulSearch = randomNumber > 0.5

// if (isSuccessfulSearch) {
//   appInsightsService.trackEvent({ name: 'ePR Referral - success', properties: { resultCount: Math.round(randomNumber * 100) } })
// } else {
//   appInsightsService.trackEvent({ name: 'ePR Referral - failure', properties: { resultCount: 0 } })
// }
// ///////////////////////////

const DATE_ERROR_MESSAGE = 'Enter a real date'
const BOOLEAN_TRUE = 'true'

const TagLabels = {
  PERMIT_TYPES: 'Permit types',
  UPLOADED_AFTER: 'Uploaded after',
  UPLOADED_BEFORE: 'Uploaded before',
  UPLOADED_BETWEEN: 'Uploaded between'
}

module.exports = [
  {
    method: 'GET',
    handler: async (request, h) => {
      const params = _getParams(request)
      const permitData = await _getPermitData(params)

      if (permitData.statusCode === 404) {
        logger.info(`Permit number ${params.permitNumber} not found`)
        return h.redirect(`/${Views.PERMIT_NOT_FOUND.route}/${params.permitNumber}`)
      }

      const context = _getContext(request, permitData, params)
      _setTags(context, params)

      return h.view(Views.VIEW_PERMIT_DETAILS.route, context)
    }
  },
  {
    method: 'POST',
    handler: async (request, h) => {
      const params = _getParams(request)
      const permitData = await _getPermitData(params)
      const context = _getContext(request, permitData, params)
      _setTags(context, params)

      return h.view(Views.VIEW_PERMIT_DETAILS.route, context)
    }
  }
]

const _getParams = request => {
  const params = {}
  const PERMIT_TYPE_EXPANDER_ID = 'permit-type-expander-expanded'
  const UPLOADED_DATE_EXPANDER_ID = 'uploaded-date-expander-expanded'
  const UPLOADED_AFTER_ID = 'uploaded-after'
  const UPLOADED_BEFORE_ID = 'uploaded-before'

  if (request.params) {
    params.permitNumber = request.params.id
  }

  if (request.method.toLowerCase() === 'get') {
    // GET
    params.page = parseInt(request.query.page) || 1
    params.sort = request.query.sort || 'newest'
    params.uploadedAfter = request.query[UPLOADED_AFTER_ID]
    params.uploadedBefore = request.query[UPLOADED_BEFORE_ID]

    if (Hoek.deepEqual(request.query, {})) {
      params.permitTypeExpanded = request.query[PERMIT_TYPE_EXPANDER_ID] === BOOLEAN_TRUE
      params.uploadedDateExpanded = request.query[UPLOADED_DATE_EXPANDER_ID] === BOOLEAN_TRUE
    } else {
      // Defaults
      params.permitTypeExpanded = true
      params.uploadedDateExpanded = false
    }
  } else {
    // POST
    params.page = parseInt(request.payload.page) || 1
    params.sort = request.payload.sort || 'newest'
    params.uploadedAfter = request.payload[UPLOADED_AFTER_ID]
    params.uploadedBefore = request.payload[UPLOADED_BEFORE_ID]
    if (request.payload.permitTypes) {
      params.permitTypes = Array.isArray(request.payload.permitTypes)
        ? request.payload.permitTypes
        : [request.payload.permitTypes]
    }

    params.permitTypeExpanded = request.payload[PERMIT_TYPE_EXPANDER_ID] === BOOLEAN_TRUE
    params.uploadedDateExpanded = request.payload[UPLOADED_DATE_EXPANDER_ID] === BOOLEAN_TRUE

    _processClickedTag(request, params)
  }

  params.uploadedAfter = validateDate(params.uploadedAfter)
  params.uploadedBefore = validateDate(params.uploadedBefore)

  return params
}

const _getPermitData = async params => {
  const middlewareService = new MiddlewareService()

  let permitData = await middlewareService.search(
    params.permitNumber,
    params.page,
    config.pageSize,
    params.sort,
    params.uploadedAfter.timestamp,
    params.uploadedBefore.timestamp,
    params.permitTypes
  )

  if (permitData.statusCode === 404 && params.page > 1) {
    params.page = 1

    permitData = await middlewareService.search(
      params.permitNumber,
      params.page,
      config.pageSize,
      params.sort,
      params.uploadedAfter.timestamp,
      params.uploadedBefore.timestamp,
      params.permitTypes
    )
  }

  if (permitData.statusCode !== 404) {
    const permitDataAllPermitTypes = await middlewareService.search(
      params.permitNumber,
      params.page,
      config.pageSize,
      params.sort,
      params.uploadedAfter.timestamp,
      params.uploadedBefore.timestamp
    )
    permitData.facets = _getFacets(permitDataAllPermitTypes.result.facets, params.permitTypes)
  }

  return permitData
}

const _getContext = (request, permitData, params) => {
  logger.info(`Carrying out search for permit number: ${params.permitNumber}`)

  // Format data for display
  if (permitData && permitData.result && permitData.result.totalCount) {
    permitData.result.items.forEach(item => {
      item.document.extensionFormatted = formatExtension(item.document.extension)
      item.document.fileSizeFormatted = formatFileSize(item.document.size)
      item.document.uploadDateFormatted = formatDate(item.document.uploadDate)
    })
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
      cachedPermitFields.forEach(item => {
        permitDetails[item] = request.payload[item]
      })
    }
  }

  const viewData = _buildViewData(permitData, params, permitDetails)

  Object.assign(viewData, {
    pageHeading: Views.VIEW_PERMIT_DETAILS.pageHeading,
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
      text: DATE_ERROR_MESSAGE
    }
  }

  return viewData
}

const _getFacets = (facets, permitTypes = []) => {
  return Object.entries(facets).map(([key, value]) => {
    return {
      value: key,
      text: `${key} (${value})`,
      checked: permitTypes.includes(key)
    }
  })
}

const _buildViewData = (permitData, params, permitDetails) => {
  const viewData = {
    permitDetails
  }

  if (permitData && permitData.result && permitData.result.totalCount) {
    const lastPage = Math.ceil(permitData.result.totalCount / config.pageSize)
    viewData.page = params.page
    viewData.previousPage = params.page > 0 ? params.page - 1 : null
    viewData.nextPage = params.page < lastPage ? params.page + 1 : null
    viewData.pageCount = lastPage
    viewData.paginationRequired = viewData.pageCount > 1
    viewData.showPaginationSeparator = viewData.previousPage && viewData.nextPage
    viewData.url = `/${Views.VIEW_PERMIT_DETAILS.route}/${permitData.result.items[0].permitDetails.permitNumber}`
  }

  viewData.sort = params.sort
  viewData.uploadedAfter = params.uploadedAfter
  viewData.uploadedBefore = params.uploadedBefore
  viewData.permitTypeExpanded = params.permitTypeExpanded
  viewData.uploadedDateExpanded = params.uploadedDateExpanded

  return viewData
}

const _setTags = (viewData, params) => {
  if (params.permitTypes && params.permitTypes.length) {
    viewData.tagRows = []

    const tagRow = { label: TagLabels.PERMIT_TYPES, tags: [], separator: 'or' }
    for (const permitType of params.permitTypes) {
      tagRow.tags.push(permitType)
    }
    viewData.tagRows.push(tagRow)
  }

  if (params.uploadedAfter.formattedDateDmy && params.uploadedBefore.formattedDateDmy) {
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

    if (params.uploadedBefore.formattedDateDmy) {
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
      case TagLabels.PERMIT_TYPES:
        _removePermitType(request, params)
    }
  }
}

const _removePermitType = (request, params) => {
  console.log('_removePermitType')
  const index = params.permitTypes.indexOf(request.payload.clickedItem)
  params.permitTypes.splice(index, 1)
}
