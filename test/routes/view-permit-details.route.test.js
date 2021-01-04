'use strict'

const server = require('../../src/server')
const TestHelper = require('../utilities/test-helper')
const mockData = require('../data/permit-data')

jest.mock('../../src/services/middleware.service')
const MiddlewareService = require('../../src/services/middleware.service')

const JourneyMap = require('@envage/hapi-govuk-journey-map')

describe('View Permit Details route', () => {
  const permitNumber = 'EAWML65519'
  const url = `/view-permit-details/${permitNumber}`
  const nextUrlUnknownPermitNumber = `/permit-not-found/${permitNumber}`

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
    sortingPanel: {
      sort: 'sort',
      sortByOptionNewest: 'sort-by-option-newest',
      sortByOptionOldest: 'sort-by-option-oldest'
    },
    filterPanel: {
      activityGroupingExpander: 'activity-grouping-expander',
      uploadedDateExpander: 'uploaded-date-expander',
      grouping: 'grouping',
      uploadedAfterLabel: 'uploaded-after-label',
      uploadedAfterHint: 'uploaded-after-hint',
      uploadedAfter: 'uploaded-after',
      uploadedBeforeLabel: 'uploaded-before-label',
      uploadedBeforeHint: 'uploaded-before-hint',
      uploadedBefore: 'uploaded-before'
    },
    documentsPanel: {
      documentsHeading: 'documents-heading',
      documentCount: 'document-count',
      documentCountSeparator: 'document-count-separator',
      documentList: 'document-list',
      documentTitle: 'document-title',
      documentDetail: 'document-detail',
      documentDetailSize: 'document-detail-size',
      cantFindTextSummary: 'cant-find-text-summary',
      documentRequestDetails: 'document-request-details',
      documentRequestDetailsInfo: 'document-request-details-info',
      email: 'email',
      emailHint: 'email-hint',
      requestDocumentsButton: 'request-documents-button'
    },
    pagination: {
      paginationPanel: 'pagination-panel',
      paginationSeparator: 'pagination-separator',
      previous: {
        Panel: 'pagination-previous',
        Icon: 'pagination-previous-icon',
        PageLabel: 'pagination-previous-page-label',
        PageCounterLabel: 'pagination-previous-page-counter-label'
      },
      next: {
        Panel: 'pagination-next',
        Icon: 'pagination-next-icon',
        PageLabel: 'pagination-next-page-label',
        PageCounterLabel: 'pagination-next-page-counter-label'
      }
    }
  }

  let document

  beforeAll(done => {
    server.events.on('start', () => {
      done()
    })
  })

  afterAll(done => {
    server.events.on('stop', () => {
      done()
    })
    server.stop()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET: Known permit number', () => {
    const getOptions = {
      method: 'GET',
      url
    }

    beforeEach(async () => {
      MiddlewareService.mockImplementation(() => {
        return {
          search: jest.fn().mockReturnValue(mockData)
        }
      })

      const getQueryData = request => {
        return { knowPermitNumber: 'yes', permitNumber }
      }

      JourneyMap.getQueryData = getQueryData

      document = await TestHelper.submitGetRequest(server, getOptions)
    })

    describe('Page headers', () => {
      it('should have the Beta banner', () => {
        TestHelper.checkBetaBanner(document)
      })

      it('should have the Back link', () => {
        TestHelper.checkBackLink(document)
      })
    })

    describe('Permit information', () => {
      it('should have the permit number caption', async () => {
        const element = document.querySelector(`#${elementIDs.permitInformation.permitNumberCaption}`)
        expect(element).toBeTruthy()
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
        expect(TestHelper.getTextContent(element)).toEqual('20 Trevor Street Hull Humberside')
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

    describe('Sorting', () => {
      it('should have the Sort dropdown', async () => {
        let element = document.querySelector(`#${elementIDs.sortingPanel.sort}`)
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.sortingPanel.sortByOptionNewest}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Newest')

        element = document.querySelector(`#${elementIDs.sortingPanel.sortByOptionOldest}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Oldest')
      })
    })

    describe('Filter panel', () => {
      it('should have the Filter panel', async () => {
        let element = document.querySelector(`#${elementIDs.filterPanel.activityGroupingExpander}`)
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.filterPanel.uploadedDateExpander}`)
        expect(element).toBeTruthy()

        for (let i = 1; i < 7; i++) {
          const index = i === 1 ? '' : `-${i}`
          element = document.querySelector(`#${elementIDs.filterPanel.grouping}${index}`)
          expect(element).toBeTruthy()
        }

        element = document.querySelector(`#${elementIDs.filterPanel.grouping}-7`)
        expect(element).toBeFalsy()

        element = document.querySelector(`#${elementIDs.filterPanel.uploadedAfterLabel}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Uploaded after')

        element = document.querySelector(`#${elementIDs.filterPanel.uploadedAfterHint}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('For example, 2005 or 21/11/2014')

        element = document.querySelector(`#${elementIDs.filterPanel.uploadedAfter}`)
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.filterPanel.uploadedBeforeLabel}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Uploaded before')

        element = document.querySelector(`#${elementIDs.filterPanel.uploadedBeforeHint}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('For example, 2005 or 21/11/2014')

        element = document.querySelector(`#${elementIDs.filterPanel.uploadedBefore}`)
        expect(element).toBeTruthy()
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
        expect(TestHelper.getTextContent(element)).toEqual('41 results')

        element = document.querySelector(`#${elementIDs.documentsPanel.documentCountSeparator}`)
        expect(element).toBeTruthy()
      })

      it('should show the document list', async () => {
        let element = document.querySelector(`#${elementIDs.documentsPanel.documentList}`)
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentCountSeparator}`)
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentTitle}-1`)
        expect(TestHelper.getTextContent(element)).toEqual('CAR Form')
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentDetail}-1`)
        expect(TestHelper.getTextContent(element)).toEqual('Licence Supervision')
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentDetailSize}-1`)
        expect(TestHelper.getTextContent(element)).toEqual('MSG - 90 KB - Uploaded 29th October 1985')
        expect(element).toBeTruthy()
      })

      it('should show the "Can\'t find what you are looking for?" details panel', async () => {
        let element = document.querySelector(`#${elementIDs.documentsPanel.cantFindTextSummary}`)
        expect(TestHelper.getTextContent(element)).toEqual("Can't find what you're looking for?")
        expect(element).toBeTruthy()

        element = document.querySelector('[for="document-request-details"]')
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual(
          'You can use the form below to submit a request for a member of our team to conduct additional searches for documents related to this permit. Responses can take up to 20 working days.'
        )

        element = document.querySelector(`#${elementIDs.documentsPanel.documentRequestDetails}`)
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.documentRequestDetailsInfo}`)
        expect(element).toBeTruthy()
        // This is the message that is displayed when JavaScript is not available
        expect(TestHelper.getTextContent(element)).toEqual('You can enter up to 2000 characters')

        element = document.querySelector('[for="email"]')
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Email address')

        element = document.querySelector(`#${elementIDs.documentsPanel.email}`)
        expect(element).toBeTruthy()

        element = document.querySelector(`#${elementIDs.documentsPanel.emailHint}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('We will send responses to this address')

        element = document.querySelector(`#${elementIDs.documentsPanel.requestDocumentsButton}`)
        expect(element).toBeTruthy()
        expect(TestHelper.getTextContent(element)).toEqual('Request documents')
      })
    })
  })

  describe('GET: Unknown permit number', () => {
    const getOptions = {
      method: 'GET',
      url
    }

    beforeEach(async () => {
      MiddlewareService.mockImplementation(() => {
        return {
          search: jest.fn().mockReturnValue({
            statusCode: 404,
            correlationId: null,
            message: 'Resource not found'
          })
        }
      })
    })

    describe('Permit information', () => {
      it('should redirect to the Permit Not Found page when the permit number is not known', async () => {
        const response = await TestHelper.getResponse(server, getOptions, 302)
        expect(response.headers.location).toEqual(nextUrlUnknownPermitNumber)
      })
    })
  })

  describe('Pagination', () => {
    const getOptions = {
      method: 'GET'
    }

    beforeEach(async () => {
      MiddlewareService.mockImplementation(() => {
        return {
          search: jest.fn().mockReturnValue(mockData)
        }
      })

      const getQueryData = request => {
        return { knowPermitNumber: 'yes', permitNumber }
      }

      JourneyMap.getQueryData = getQueryData
    })

    it('should hide the PREVIOUS pagination control when the first page is being displayed', async () => {
      getOptions.url = `${url}`
      document = await TestHelper.submitGetRequest(server, getOptions)

      let element = document.querySelector(`#${elementIDs.pagination.paginationPanel}`)
      expect(element).toBeTruthy()

      element = document.querySelector(`#${elementIDs.pagination.paginationSeparator}`)
      expect(element).toBeFalsy()

      element = document.querySelector(`#${elementIDs.pagination.previous.Panel}`)
      expect(element).toBeFalsy()

      checkNextButton(document, 2, 3)
    })

    it('should show pagination controls when a middle page is being dislayed', async () => {
      getOptions.url = `${url}?page=2`
      document = await TestHelper.submitGetRequest(server, getOptions)

      let element = document.querySelector(`#${elementIDs.pagination.paginationPanel}`)
      expect(element).toBeTruthy()

      element = document.querySelector(`#${elementIDs.pagination.paginationSeparator}`)
      expect(element).toBeTruthy()

      checkPreviousButton(document, 1, 3)
      checkNextButton(document, 3, 3)
    })

    it('should hide the NEXT pagination control when the last page is being displayed', async () => {
      getOptions.url = `${url}?page=3`
      document = await TestHelper.submitGetRequest(server, getOptions)

      let element = document.querySelector(`#${elementIDs.pagination.paginationPanel}`)
      expect(element).toBeTruthy()

      element = document.querySelector(`#${elementIDs.pagination.paginationSeparator}`)
      expect(element).toBeFalsy()

      element = document.querySelector(`#${elementIDs.pagination.next.Panel}`)
      expect(element).toBeFalsy()

      checkPreviousButton(document, 2, 3)
    })

    const checkPreviousButton = (document, expectedPageNumber, expectedPageCount) => {
      let element = document.querySelector(`#${elementIDs.pagination.previous.Panel}`)
      expect(element).toBeTruthy()
      element = document.querySelector(`#${elementIDs.pagination.previous.Icon}`)
      expect(element).toBeTruthy()
      element = document.querySelector(`#${elementIDs.pagination.previous.PageLabel}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Previous page')
      element = document.querySelector(`#${elementIDs.pagination.previous.PageCounterLabel}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual(`${expectedPageNumber} of ${expectedPageCount}`)
    }

    const checkNextButton = (document, expectedPageNumber, expectedPageCount) => {
      let element = document.querySelector(`#${elementIDs.pagination.next.Panel}`)
      expect(element).toBeTruthy()
      element = document.querySelector(`#${elementIDs.pagination.next.Icon}`)
      expect(element).toBeTruthy()
      element = document.querySelector(`#${elementIDs.pagination.next.PageLabel}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Next page')
      element = document.querySelector(`#${elementIDs.pagination.next.PageCounterLabel}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual(`${expectedPageNumber} of ${expectedPageCount}`)
    }
  })
})
