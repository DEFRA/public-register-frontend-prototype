const DOMParser = require('xmldom').DOMParser

module.exports = class GeneralTestHelper {
  static async submitRequest (server, options) {
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const parser = new DOMParser()
    return parser.parseFromString(response.payload, 'text/html')
  }

  static checkElementsExist (document, elementIds) {
    if (elementIds && Array.isArray(elementIds) && elementIds.length) {
      for (let i = 0; i < elementIds.length; i++) {
        try {
          expect(document.getElementById(elementIds[i])).toBeTruthy()
        } catch (e) {
          throw new Error(`Element with ID [${elementIds[i]}] does not exist`)
        }
      }
    }
  }

  static checkElementsDoNotExist (document, elementIds) {
    if (elementIds && Array.isArray(elementIds) && elementIds.length) {
      for (let i = 0; i < elementIds.length; i++) {
        try {
          expect(document.getElementById(elementIds[i])).toBeFalsy()
        } catch (e) {
          throw new Error(`Element with ID [${elementIds[i]}] exists when it shoudn't`)
        }
      }
    }
  }
}
