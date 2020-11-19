'use strict'

const server = require('../../src/server')
const TestHelper = require('../utilities/test-helper')

jest.mock('../../src/services/middleware.service')
const MiddlewareService = require('../../src/services/middleware.service')

describe('Download route', () => {
  const filename = 'XXXXX/YYYYY.pdf'
  const url = `/download?document=${filename}`
  const getOptions = {
    method: 'GET',
    url
  }

  const elementIDs = {
    heading: 'unable-to-download-heading',
    fileId: 'file-id',
    fileNotFound: 'file-not-found-message'
  }

  let document

  beforeAll((done) => {
    server.events.on('start', () => {
      done()
    })
  })

  afterAll((done) => {
    jest.clearAllMocks()

    server.events.on('stop', () => {
      done()
    })
    server.stop()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET: Document not found', () => {
    beforeEach(async () => {
      MiddlewareService.mockImplementation(() => {
        return {
          download: jest.fn().mockImplementation(() => {
            throw new Error()
          })
        }
      })

      document = await TestHelper.submitGetRequest(server, getOptions)
    })

    describe('Page headers', () => {
      it('should have the Beta banner', () => {
        TestHelper.checkBetaBanner(document)
      })

      it('should not have the Back link', () => {
        TestHelper.checkBackLink(document, false)
      })
    })

    describe('Document information', () => {
      it('should have the page heading', async () => {
        const element = document.querySelector(`#${elementIDs.heading}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Unable to download document')
      })

      it('should show the file ID', async () => {
        const element = document.querySelector(`#${elementIDs.fileId}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual(filename)
      })

      it('should have the "File not found" message', async () => {
        const element = document.querySelector(`#${elementIDs.fileNotFound}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('File not found')
      })
    })
  })

  describe('GET: Document found', () => {
    beforeEach(async () => {
      MiddlewareService.mockImplementation(() => {
        return {
          download: jest.fn().mockReturnValue({})
        }
      })

      document = await TestHelper.submitGetRequest(server, getOptions)
    })

    it('should open the document', async () => {
      expect(document).toBeTruthy()
    })
  })
})
