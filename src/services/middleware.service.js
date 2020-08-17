const fetch = require('node-fetch')

class MiddlewareService {
  async getData (url) {
    console.log('get data method called')
    try {
      const response = await fetch(url)
      const json = await response.json()
      console.log(json)
      return json
    } catch (error) {
      console.log(error)
    }
  }
}

// Probable public endpoints:
// /api/filterSelection - returns reference data (e.g. filter contents)
// Rename /api/referenceData and cache in local storage?

// /api/search - search for documents based on filter criteria
// /api/document/{id} - download a document

// Download multiple files in a zip file?
// /api/documents/{ids} - download zipper documents ????

module.exports = MiddlewareService
