'use strict'

// Service status page to make it easy to determine the status and version of the service
module.exports = {
  plugin: require('hapi-version-status'),
  options: {
    path: '/service-status',
    view: 'service-status',
    viewData: {
      pageHeading: 'Service Status'
    }
  }
}
