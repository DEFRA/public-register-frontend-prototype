'use strict'

const nock = require('nock')

const MiddlewareService = require('../../src/services/middleware.service')
const config = require('../../src/config/config')
const mockData = require('../data/permit-data')

describe('Middleware service', () => {
  let middlewareService
  const permitNumber = 'EAWML65519'
  const sanitisedPermitNumber = 'EAWML 65519'
  const register = 'Installations'
  const pageNumber = 1
  const pageSize = 20
  const orderBy = 'UploadDate desc'

  const filename = 'Permit X/Document Y.pdf'
  const filenameUnknown = 'UNKNOWN_DOCUMENT.pdf'

  beforeEach(() => {
    middlewareService = new MiddlewareService()

    nock(`https://${config.middlewareEndpoint}`)
      .get(`/v1/Download?downloadURL=${filename}`)
      .reply(200, {})

    nock(`https://${config.middlewareEndpoint}`)
      .get(`/v1/Download?downloadURL=${filenameUnknown}`)
      .reply(404, {})

    nock(`https://${config.middlewareEndpoint}`)
      .get(
        `/v1/search?query=${sanitisedPermitNumber}&filter=RegulatedActivityClass eq 'Installations' and PermitNumber eq '${sanitisedPermitNumber}' and UploadDate ge 1950-02-01T00:00:00Z and UploadDate le 2021-12-31T00:00:00Z and (ActivityGrouping eq 'General')&pageNumber=${pageNumber}&pageSize=${pageSize}&orderby=${orderBy}`
      )
      .reply(200, mockData)

    nock(`https://${config.middlewareEndpoint}`)
      .head(
        `/v1/search?query=${permitNumber}&filter=RegulatedActivityClass eq 'Installations' and PermitNumber eq '${permitNumber}'`
      )
      .reply(200)

    nock(`https://${config.middlewareEndpoint}`)
      .head(
        "/v1/search?query=UNKNOWN_PERMIT_NUMBER&filter=RegulatedActivityClass eq 'Installations' and PermitNumber eq 'UNKNOWN_PERMIT_NUMBER'"
      )
      .reply(404)

    nock(`https://${config.middlewareEndpoint}`)
      .get(
        "/v1/search?query=*&filter=UploadDate ge 1950-02-01T00:00:00Z and UploadDate le 2021-12-31T00:00:00Z and (ActivityGrouping eq 'General') and (search.ismatchscoring('some', 'DocTitle') or search.ismatchscoring('some', 'CustomerOperatorName') or search.ismatchscoring('some', 'SiteName') or search.ismatchscoring('some', 'FacilityAddressPostcode')) and (search.ismatchscoring('text', 'DocTitle') or search.ismatchscoring('text', 'CustomerOperatorName') or search.ismatchscoring('text', 'SiteName') or search.ismatchscoring('text', 'FacilityAddressPostcode'))&pageNumber=1&pageSize=20&orderby=UploadDate desc"
      )
      .reply(200, mockData)
  })

  afterEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  describe('download method', () => {
    it('should return the correct results', async () => {
      expect(middlewareService).toBeTruthy()
      const results = await middlewareService.download(filename)
      expect(results).toBeTruthy()
    })

    it('should throw an error when the document cannot be found', async () => {
      expect(middlewareService).toBeTruthy()
      await expect(middlewareService.download(filenameUnknown)).rejects.toThrow(
        `Document ID: [${filenameUnknown}] not found`
      )
    })
  })

  describe('checkPermitExists method', () => {
    it('should return true if the permit exists', async () => {
      expect(middlewareService).toBeTruthy()
      const results = await middlewareService.checkPermitExists(permitNumber, register)
      expect(results).toBeTruthy()
    })

    it('should return false if the permit does not exist', async () => {
      expect(middlewareService).toBeTruthy()
      const results = await middlewareService.checkPermitExists('UNKNOWN_PERMIT_NUMBER', register)
      expect(results).toBeFalsy()
    })
  })

  describe('search method', () => {
    it('should return the correct results', async () => {
      expect(middlewareService).toBeTruthy()

      const params = {
        permitNumber,
        sanitisedPermitNumber,
        register,
        documentTypes: ['General'],
        page: 1,
        pageSize: 20,
        sort: 'newest',
        uploadedAfter: { timestamp: '1950-02-01T00:00:00Z' },
        uploadedBefore: { timestamp: '2021-12-31T00:00:00Z' },
        activityGrouping: []
      }
      const permitData = await middlewareService.search(params)

      expect(permitData.result.items).toBeTruthy()
      expect(permitData.result.totalCount).toEqual(41)

      expect(permitData.result.items[0].permitDetails.activityGrouping).toEqual('Licence Supervision')
      expect(permitData.result.items[0].document.title).toEqual('CAR Form')
      expect(permitData.result.items[0].document.size).toEqual(89600)
      expect(permitData.result.items[0].document.uploadDate).toEqual('1985-10-29T00:00:00Z')
      expect(permitData.result.items[0].document.docLocation).toEqual('PublicRegister/00000013.msg')
    })
  })

  describe('searchIncludingAllDocumentTypes method', () => {
    beforeEach(() => {
      middlewareService.search = jest.fn()
    })

    it('should return the correct results', async () => {
      const params = {
        permitNumber,
        sanitisedPermitNumber,
        register,
        page: 1,
        pageSize: 20,
        sort: 'newest',
        uploadedAfter: { timestamp: '1950-02-01T00:00:00Z' },
        uploadedBefore: { timestamp: '2021-12-31T00:00:00Z' },
        activityGrouping: []
      }

      expect(middlewareService.search).toBeCalledTimes(0)

      middlewareService.searchIncludingAllDocumentTypes(params)

      expect(middlewareService.search).toBeCalledTimes(1)
    })
  })

  describe('searchAcrossPermits method', () => {
    it('should return the correct results', async () => {
      expect(middlewareService).toBeTruthy()

      const params = {
        documentSearch: 'some text',
        documentTypes: ['General'],
        page: 1,
        pageSize: 20,
        sort: 'newest',
        uploadedAfter: { timestamp: '1950-02-01T00:00:00Z' },
        uploadedBefore: { timestamp: '2021-12-31T00:00:00Z' },
        activityGrouping: []
      }
      const permitData = await middlewareService.searchAcrossPermits(params)

      expect(permitData.result.items).toBeTruthy()
      expect(permitData.result.totalCount).toEqual(41)

      expect(permitData.result.items[0].permitDetails.activityGrouping).toEqual('Licence Supervision')
      expect(permitData.result.items[0].document.title).toEqual('CAR Form')
      expect(permitData.result.items[0].document.size).toEqual(89600)
      expect(permitData.result.items[0].document.uploadDate).toEqual('1985-10-29T00:00:00Z')
      expect(permitData.result.items[0].document.docLocation).toEqual('PublicRegister/00000013.msg')
    })
  })
})
