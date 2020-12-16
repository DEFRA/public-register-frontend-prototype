'use strict'

// const Joi = require('joi')

const { logger } = require('defra-logging-facade')
// const { handleValidationErrors, raiseCustomValidationError } = require('../utils/validation')

const config = require('../config/config')
const { Views } = require('../constants')
const { formatDate, formatTimestamp, formatExtension, formatFileSize } = require('../utils/general')
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

module.exports = [
  {
    method: 'GET',
    handler: async (request, h) => {
      console.log('####### GET')

      const params = _getParams(request)

      const viewData = await _getViewData(request, params)

      return h.view(Views.VIEW_PERMIT_DETAILS.route, viewData)
    }
  },
  {
    method: 'POST',
    handler: async (request, h) => {
      console.log('####### POST')

      const params = _getParams(request)

      const viewData = await _getViewData(request, params)

      return h.view(Views.VIEW_PERMIT_DETAILS.route, viewData)

      // if (true) {
      //   return h.redirect(`/${Views.VIEW_PERMIT_DETAILS.route}/${santisedPermitNumber}`)
      // } else {
      //   return raiseCustomValidationError(
      //     h,
      //     Views.ENTER_PERMIT_NUMBER.route,
      //     { knowPermitNumber, permitNumber },
      //     {
      //       heading: 'To continue, please address the following:',
      //       fieldId: 'permitNumber',
      //       errorText: 'Sorry, no permit was found',
      //       useHref: false
      //     },
      //     {
      //       fieldId: 'permitNumber',
      //       errorText: 'Enter a different permit number'
      //     }
      //   )
      // }
    },
    options: {
      // validate: {
      //   payload: Joi.object({
      //   }),
      //   failAction: async (request, h, errors) => {
      //     return handleValidationErrors(request, h, errors, Views.ENTER_PERMIT_NUMBER.route, data, messages)
      //   }
      // }
    }
  }
]

const _getParams = request => {
  const params = {}

  if (request.params) {
    params.permitNumber = request.params.id
  }

  if (request.method.toLowerCase() === 'get') {
    // GET
    params.page = parseInt(request.query.page) || 1
    params.sort = request.query.sort || 'newest'
    params.uploadedAfter = request.query['uploaded-after']
    params.uploadedBefore = request.query['uploaded-before']

    // TODO set or use defaults
    params.activityGroupingExpanded = true
    params.uploadedDateExpanded = true
  } else {
    // POST
    params.page = parseInt(request.payload.page) || 1
    params.sort = request.payload.sort || 'newest'
    params.uploadedAfter = request.payload['uploaded-after']
    params.uploadedBefore = request.payload['uploaded-before']
    if (request.payload.grouping) {
      params.grouping = Array.isArray(request.payload.grouping) ? request.payload.grouping : [request.payload.grouping]
    }

    // TODO set or use defaults
    params.activityGroupingExpanded = true
    params.uploadedDateExpanded = true
  }

  return params
}

const _getViewData = async (request, params) => {
  logger.info(`Carrying out search for permit number: ${params.permitNumber}`)

  const middlewareService = new MiddlewareService()

  const permitData = await middlewareService.search(
    params.permitNumber,
    params.page,
    config.pageSize,
    params.sort,
    formatTimestamp(params.uploadedAfter),
    formatTimestamp(params.uploadedBefore),
    params.grouping
  )

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
      // permitDetails = {
      //   permitNumber: request.payload.permitNumber,
      //   siteName: request.payload.siteName,
      //   register: request.payload.register,
      //   address: request.payload.address,
      //   postcode: request.payload.postcode
      // }
      permitDetails = {}
      const x = ['permitNumber', 'register', 'address', 'postcode', 'grouping']
      x.forEach(item => {
        permitDetails[item] = request.payload[item]
      })
    }
  }

  // if (request.payload) {
  //   permitDetails.grouping = request.payload.grouping
  // }

  if (permitData.statusCode === 404) {
    logger.info(`Permit number ${params.permitNumber} not found`)
  } else {
    permitData.facets = _getFacets(permitData, params.grouping)
  }

  const viewData = _buildViewData(permitData, params, permitDetails)

  Object.assign(viewData, {
    pageHeading: Views.VIEW_PERMIT_DETAILS.pageHeading,
    id: params.permitNumber,
    permitData
  })

  return viewData
}

const _getFacets = (permitData, grouping = []) => {
  return Object.entries(permitData.result.facets).map(([key, value]) => {
    return {
      value: key,
      text: `${key} (${value})`,
      checked: grouping.includes(key)
    }
  })
}

// Params:
// page,
// sort,
// uploadedAfter,
// uploadedBefore,
// activityGroupingExpanded,
// uploadedDateExpanded
const _buildViewData = (permitData, params, permitDetails) => {
  const viewData = {
    permitDetails
  }

  if (permitData && permitData.result && permitData.result.totalCount) {
    const lastPage = Math.ceil(permitData.result.totalCount / config.pageSize)
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
  viewData.activityGroupingExpanded = params.activityGroupingExpanded
  viewData.uploadedDateExpanded = params.uploadedDateExpanded

  return viewData
}
