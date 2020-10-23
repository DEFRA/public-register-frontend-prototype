'use strict'

// const DOMParser = require('xmldom').DOMParser
const jsdom = require('jsdom')
const { JSDOM } = jsdom

const elementIDs = {
  backLink: 'back-link'
}

module.exports = class TestHelper {
  static async submitRequest (server, options) {
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    return new JSDOM(response.payload).window.document
  }

  static checkBetaBanner (document) {
    const element = document.querySelector('.govuk-phase-banner__content__tag')
    expect(element).toBeTruthy()
    expect(TestHelper.getTextContent(element).toLowerCase()).toEqual('beta')
  }

  static checkBackLink (document, expectToExist = true) {
    const element = document.querySelector(`#${elementIDs.backLink}`)
    if (expectToExist) {
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Back')
    } else {
      expect(element).toBeFalsy()
    }
  }

  static checkElementsExist (document, elementIds) {
    if (elementIds && Array.isArray(elementIds) && elementIds.length) {
      for (let i = 0; i < elementIds.length; i++) {
        try {
          expect(document.querySelector(`#${elementIds[i]}`)).toBeTruthy()
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
          expect(document.querySelector(`#${elementIds[i]}`)).toBeFalsy()
        } catch (e) {
          throw new Error(`Element with ID [${elementIds[i]}] exists when it shoudn't`)
        }
      }
    }
  }

  static getTextContent (element) {
    return element && element.textContent ? element.textContent.trim() : null
  }

  // static wait (delay = 1000) {
  //   return new Promise((resolve) => setTimeout(resolve, delay))
  // }
}
