'use strict'

const nock = require('nock')

const server = require('../../src/server')
const TestHelper = require('../utilities/test-helper')
const mockData = require('../data/permit-data')
const MIDDLEWARE_ENDPOINT = 'https://api.mantaqconsulting.co.uk'

describe('View Permit Details route', () => {
  const url = '/view-permit-details'

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
    }
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

  beforeEach(async () => {
    nock(MIDDLEWARE_ENDPOINT)
      .get('/api/v1/Search')
      .reply(200, mockData)
  })

  afterEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  describe('GET', () => {
    const getOptions = {
      method: 'GET',
      url
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
        const permitNumber = 'ABC123/45'
        expect(TestHelper.getTextContent(element)).toEqual(`Permit ${permitNumber}`)
      })

      it('should have the site name heading', async () => {
        const element = document.querySelector(`#${elementIDs.permitInformation.siteNameHeading}`)
        expect(element).toBeTruthy()
        const siteName = 'AJ Spares'
        expect(TestHelper.getTextContent(element)).toEqual(`${siteName}`)
      })

      it('should show the permit Register', async () => {
        let element = document.querySelector(`#${elementIDs.summaryList.registerKey}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Register')

        element = document.querySelector(`#${elementIDs.summaryList.registerValue}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Waste Carriers and Brokers Public Register for England')
      })

      it('should show the permit Address', async () => {
        let element = document.querySelector(`#${elementIDs.summaryList.addressKey}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Address')

        element = document.querySelector(`#${elementIDs.summaryList.addressValue}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('WORTLEY ROAD, ROTHERHAM')
      })

      it('should show the permit Postcode', async () => {
        let element = document.querySelector(`#${elementIDs.summaryList.postcodeKey}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Postcode')

        element = document.querySelector(`#${elementIDs.summaryList.postcodeValue}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('S61 1LZ')
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
        expect(TestHelper.getTextContent(element)).toEqual('3 results')

        element = document.querySelector(`#${elementIDs.documentsPanel.documentCountSeparator}`)
        expect(element).toBeTruthy()
      })

      it('should show the document list', async () => {
        let element = document.querySelector(`#${elementIDs.documentsPanel.documentList}`)
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentCountSeparator}`)
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentTitle}-1`)
        expect(TestHelper.getTextContent(element)).toEqual('Document 1')
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentDetail}-1`)
        expect(TestHelper.getTextContent(element)).toEqual('Compliance')
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentDetailSize}-1`)
        expect(TestHelper.getTextContent(element)).toEqual('100kb - Updated 01/01/2001')
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentTitle}-2`)
        expect(TestHelper.getTextContent(element)).toEqual('Document 2')
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentDetail}-2`)
        expect(TestHelper.getTextContent(element)).toEqual('General')
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentDetailSize}-2`)
        expect(TestHelper.getTextContent(element)).toEqual('200kb - Updated 02/01/2001')
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentTitle}-3`)
        expect(TestHelper.getTextContent(element)).toEqual('Document 3')
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentDetail}-3`)
        expect(TestHelper.getTextContent(element)).toEqual('Returns')
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentDetailSize}-3`)
        expect(TestHelper.getTextContent(element)).toEqual('300kb - Updated 03/01/2001')
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
})
