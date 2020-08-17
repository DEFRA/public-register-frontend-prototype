'use strict'

// Plugin recursively sanitizes or prunes values in a request.payload object.
module.exports = {
  plugin: require('hapi-sanitize-payload'),
  options: {
    pruneMethod: 'delete'
  }
}
