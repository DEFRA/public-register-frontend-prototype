'use strict'

const MiddlewareService = require('../services/middleware.service')

module.exports = [{
  method: 'GET',
  handler: async (request, h) => {
    const middlewareService = new MiddlewareService()
    const data = await middlewareService.getData('https://jsonplaceholder.typicode.com/todos/1')
    console.log('got data', data)

    return h.view('home', {
      pageHeading: 'Welcome',
      pageText: 'Here is my first GOV.UK Design System styled page',
      data: data
    })
  }

}, {
  method: 'POST',
  handler: (request, h) => h.continue
}]
