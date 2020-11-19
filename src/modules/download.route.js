'use strict'

const { logger } = require('defra-logging-facade')
const { getContentType } = require('../utils/general')
const MiddlewareService = require('../services/middleware.service')
const view = 'download'

module.exports = {
  method: 'GET',
  handler: async (request, h) => {
    const id = request.query.document
    logger.info(`Downloading document: ${id}`)

    try {
      const middlewareService = new MiddlewareService()
      const permitData = await middlewareService.download(id)

      // ID is formatted as 'permit/filename.extension'
      const filename = id.split('/')[1]
      const fileType = filename.substring(filename.length - 3, filename.length).toLowerCase()
      const contentType = getContentType(fileType)

      // If the document is a PDF then open it in the browser, otherwise mark it as an attachment for download
      const contentDisposition = fileType === 'pdf' ? 'inline' : 'attachment'

      return h.response(permitData)
        .header('Content-Type', contentType)
        .header('Content-Disposition', `${contentDisposition}; filename=${filename}`)
        .takeover()
    } catch (err) {
      logger.info(err)

      return h.view(view, {
        pageHeading: 'Unable to download document',
        id
      })
    }
  }
}
