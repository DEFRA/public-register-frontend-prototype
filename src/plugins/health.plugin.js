'use strict'

// Plugin provides a health route for the hapi.js server
module.exports = {
  plugin: require('hapi-alive'),
  options: {
    path: '/health', // Health route path
    tags: ['health', 'monitor'],
    healthCheck: async () => {
      // Here you should preform your health checks
      // If something went wrong , throw an error.
      // if (somethingFailed) {
      //   throw new Error('Server not healthy')
      // }
      return await true
    }
  }
}
