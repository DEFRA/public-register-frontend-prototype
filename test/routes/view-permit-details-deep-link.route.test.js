'use strict'

const server = require('../../src/server')
const TestHelper = require('../utilities/test-helper')
const mockData = require('../data/permit-data')

jest.mock('../../src/services/middleware.service')
const MiddlewareService = require('../../src/services/middleware.service')

describe('View Permit Details Deep Link route', () => {
  const elementIDs = {
    permitInformation: {
      permitNumberCaption: 'permit-number-caption',
      siteNameHeading: 'site-name-heading'
    },
    summaryList: {
      registerKey: 'summary-list-register-key',
      registerValue: 'summary-list-register-value',
      addressKey: 'summary-list-address-key',
      addressValue: 'summary-list-address-value',
      postcodeKey: 'summary-list-postcode-key',
      postcodeValue: 'summary-list-postcode-value'
    },
    filterPanel: 'filter-panel',
    documentsPanel: {
      documentsHeading: 'documents-heading',
      documentCount: 'document-count',
      documentCountSeparator: 'document-count-separator',
      documentList: 'document-list',
      documentTitle: 'document-title',
      documentDetail: 'document-detail',
      documentDetailSize: 'document-detail-size',
      cantFindTextSummary: 'cant-find-text-summary',
      cantFindTextHint: 'cant-find-text-hint'
    },
    permitNotFoundMessage: 'permit-not-found-message'
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

  describe('GET: Known permit number', () => {
    beforeEach(() => {
      MiddlewareService.mockImplementation(() => {
        return {
          search: jest.fn().mockReturnValue(mockData)
        }
      })
    })

    const getOptions = {
      method: 'GET',
      url: '/view-permit-details/EAWML65519'
    }

    beforeEach(async () => {
      document = await TestHelper.submitGetRequest(server, getOptions)
    })

    describe('Page headers', () => {
      it('should have the Beta banner', () => {
        TestHelper.checkBetaBanner(document)
      })

      it('should not have the Back link', () => {
        TestHelper.checkBackLink(document)
      })
    })

    describe('Permit information', () => {
      it('should have the permit number caption', async () => {
        const element = document.querySelector(`#${elementIDs.permitInformation.permitNumberCaption}`)
        expect(element).toBeTruthy()
        const permitNumber = 'EAWML65519'
        expect(TestHelper.getTextContent(element)).toEqual(`Permit ${permitNumber}`)
      })

      it('should have the site name heading', async () => {
        const element = document.querySelector(`#${elementIDs.permitInformation.siteNameHeading}`)
        expect(element).toBeTruthy()
        const siteName = 'Site On Trevor Street'
        expect(TestHelper.getTextContent(element)).toEqual(`${siteName}`)
      })

      it('should show the permit Register', async () => {
        let element = document.querySelector(`#${elementIDs.summaryList.registerKey}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Register')

        element = document.querySelector(`#${elementIDs.summaryList.registerValue}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Water Discharges')
      })

      it('should show the permit Address', async () => {
        let element = document.querySelector(`#${elementIDs.summaryList.addressKey}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Address')

        element = document.querySelector(`#${elementIDs.summaryList.addressValue}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('3 Trevor Street Hull Humberside')
      })

      it('should show the permit Postcode', async () => {
        let element = document.querySelector(`#${elementIDs.summaryList.postcodeKey}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Postcode')

        element = document.querySelector(`#${elementIDs.summaryList.postcodeValue}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('HU2 0HR')
      })
    })

    describe('Filter panel', () => {
      it('should have the Filter panel', async () => {
        const element = document.querySelector(`#${elementIDs.filterPanel}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('FILTER PANEL')
      })
    })

    describe('Documents panel', () => {
      it('should have the "Documents" heading', async () => {
        const element = document.querySelector(`#${elementIDs.documentsPanel.documentsHeading}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Documents')
      })

      it('should show the result count', async () => {
        let element = document.querySelector(`#${elementIDs.documentsPanel.documentCount}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('38 results')

        element = document.querySelector(`#${elementIDs.documentsPanel.documentCountSeparator}`)
        expect(element).toBeTruthy()
      })

      it('should show the document list', async () => {
        let element = document.querySelector(`#${elementIDs.documentsPanel.documentList}`)
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentCountSeparator}`)
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentTitle}-1`)
        expect(TestHelper.getTextContent(element)).toEqual('Compliance Returns Correspondence Apr to Jun 2016 Rejected')
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentDetail}-1`)
        expect(TestHelper.getTextContent(element)).toEqual('Waste Returns')
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentDetailSize}-1`)
        expect(TestHelper.getTextContent(element)).toEqual('10 - Updated 12/10/1985')
        expect(element).toBeTruthy()
      })

      it('should show the "Can\'t find what you are looking for?" details panel', async () => {
        let element = document.querySelector(`#${elementIDs.documentsPanel.cantFindTextSummary}`)
        expect(TestHelper.getTextContent(element)).toEqual('Can\'t find what you\'re looking for?')
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.cantFindTextHint}`)
        expect(element).toBeTruthy()
      })
    })
  })

  describe('GET: Unknown permit number', () => {
    const unknownPermitNumber = 'XXXXXXX'
    beforeEach(() => {
      MiddlewareService.mockImplementation(() => {
        return {
          search: jest.fn().mockReturnValue({ statusCode: 404, correlationId: null, message: 'Resource not found' })
        }
      })
    })

    const getOptions = {
      method: 'GET',
      url: `/view-permit-details/${unknownPermitNumber}`
    }

    beforeEach(async () => {
      document = await TestHelper.submitGetRequest(server, getOptions)
    })

    describe('Page headers', () => {
      it('should have the Beta banner', () => {
        TestHelper.checkBetaBanner(document)
      })

      it('should not have the Back link', () => {
        TestHelper.checkBackLink(document)
      })
    })

    describe('Permit information', () => {
      it('should have the "permit not found" message', async () => {
        const element = document.querySelector(`#${elementIDs.permitNotFoundMessage}`)
        expect(element).toBeTruthy()
      })
    })
  })
})
