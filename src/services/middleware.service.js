const fetch = require('node-fetch')

class MiddlewareService {
  async getData (url) {
    try {
      const response = await fetch(url)
      const json = await response.json()
      return json
    } catch (error) {
      console.error(error)
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
