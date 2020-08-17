'use strict'

const pkg = require('../../package.json')

// Frontend plugin registers a govuk frontend
module.exports = {
  plugin: require('@envage/hapi-govuk-frontend'),
  options: {
    assetPath: '/assets',
    assetDirectories: ['public/static', 'public/build'],
    serviceName: 'Public Register of Documents',
    viewPath: 'src/modules',
    includePaths: [],
    context: {
      appVersion: pkg.version
    }
  }
}
