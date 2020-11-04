'use strict'

const moment = require('moment')
const nodePackage = require('../../package.json')

const view = 'service-status'
const dateFormat = 'DD/MM/YYYY HH:mm:ss'

module.exports = [{
  method: 'GET',
  handler: (request, h) => {
    return h.view(view, {
      pageHeading: 'Service status',
      data: {
        name: nodePackage.name,
        version: nodePackage.version,
        rendered: moment(new Date()).format(dateFormat),
        uptime: moment(Date.now() - (process.uptime() * 1000)).format(dateFormat)
      }
    })
  }
}]
