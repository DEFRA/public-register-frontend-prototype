'use strict'

const { logger } = require('defra-logging-facade')
const MiddlewareService = require('../services/middleware.service')

// const fs = require('fs')
// const path = require('path')
// const { Readable } = require('stream')

// const Hoek = require('hoek')
// const { logger } = require('defra-logging-facade')
// const { getQueryData } = require('@envage/hapi-govuk-journey-map')

// const MiddlewareService = require('../services/middleware.service')
// const view = 'download'

// These imports will be needed when developing Feature 12215 (Monitor performance of service) and
// Story 7158 (View permit documents, view permit page)
// const AppInsightsService = require('../services/app-insights.service')
// const appInsightsService = new AppInsightsService()

// const getContentType = (fileExt) => {
//   let contentType
//   switch (fileExt) {
//     case 'pdf':
//       contentType = 'application/pdf'
//       break
//     case 'ppt':
//       contentType = 'application/vnd.ms-powerpoint'
//       break
//     case 'pptx':
//       contentType = 'application/vnd.openxmlformats-officedocument.preplyentationml.preplyentation'
//       break
//     case 'xls':
//       contentType = 'application/vnd.ms-excel'
//       break
//     case 'xlsx':
//       contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//       break
//     case 'doc':
//       contentType = 'application/msword'
//       break
//     case 'docx':
//       contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//       break
//     case 'csv':
//       contentType = 'application/octet-stream'
//       break
//     case 'xml':
//       contentType = 'application/xml'
//       break
//   }
//   return contentType
// }

module.exports = {
  method: 'GET',
  handler: async (request, h) => {
    console.log('##### DOWNLOAD GET')

    const id = 'PublicRegister-Dummy/00000001.msg'
    logger.info(`Downloading document: ${id}`)

    const middlewareService = new MiddlewareService()

    const permitData = await middlewareService.download(id)
    console.log(permitData)

    return h.redirect('http://news.bbc.co.uk')
    // return h.response('success')
    //   .type('text/plain')
    //   .header('X-Custom', 'some-value')

    // h(permitData)
    // console.log(__dirname)
    // const filePath = '../../test/data/example.pdf'
    // const filePath = path.join(__dirname, '/example.pdf')
    // console.log(filePath)

    // const stream = fs.createReadStream(permitData)
    // const streamData = new Readable().wrap(stream)

    // return h.abandon()
    // return h.response(streamData)

    // return h
    //   .file(permitData, {
    //     mode: 'attachment',
    //     filename: 'bob.txt'
    //   })
    //   // .header('Content-Type', getContentType('pdf'))
    // .header('Content-Type', 'application/pdf')
    // .header('Content-Disposition', 'attachment; filename= ' + 'example.pdf')

    // return permitData
    // return h.file(permitData)
    // return h.view(view, {
    //   // pageHeading: 'Permit details',
    //   // id,
    //   // permitData
    // })
  }
}
