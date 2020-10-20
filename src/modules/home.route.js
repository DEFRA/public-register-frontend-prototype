'use strict'

module.exports = [{
  method: 'GET',
  handler: (request, h) => h.view('home', {
    pageHeading: 'Public Register of Documents',
    pageText: 'Use this service to obtain documents from the Environment Agency Public Registers'
  })
}, {
  method: 'POST',
  handler: (request, h) => h.continue
}]
