'use strict'

// Prevent search engines from crawling through the service
module.exports = {
  plugin: require('hapi-robots'),
  options: {
    // Disallow everyone from every path:
    '*': ['/']
  }
}
