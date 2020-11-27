'use strict'

const moment = require('moment')
const nodePackage = require('../../package.json')

const { Views } = require('../constants')
const DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss'

module.exports = [{
  method: 'GET',
  handler: (request, h) => {
    return h.view(Views.SERVICE_STATUS.route, {
      pageHeading: Views.SERVICE_STATUS.pageHeading,
      data: {
        name: nodePackage.name,
        version: nodePackage.version,
        rendered: moment(new Date()).format(DATE_FORMAT),
        uptime: moment(Date.now() - (process.uptime() * 1000)).format(DATE_FORMAT)
      }
    })
  }
}]
