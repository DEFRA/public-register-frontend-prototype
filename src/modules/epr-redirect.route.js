'use strict'

module.exports = [{
  method: 'GET',
  handler: async (request, h) => {
    return h.redirect('https://environment.data.gov.uk/public-register/view/index')
  }
}]
