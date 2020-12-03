'use strict'

const nock = require('nock')

const MiddlewareService = require('../../src/services/middleware.service')
const config = require('../../src/config/config')
const mockData = require('../data/permit-data')

describe('Middleware service', () => {
  let middlewareService
  const permitNumber = 'EAWML65519'
  const filename = 'Permit X/Document Y.pdf'
  const filenameUnknown = 'UNKNOWN_DOCUMENT.pdf'

  beforeEach(async () => {
    middlewareService = new MiddlewareService()

    nock(`https://${config.middlewareEndpoint}`)
      .get(`/v1/Download?downloadURL=${filename}`)
      .reply(200, {})

    nock(`https://${config.middlewareEndpoint}`)
      .get(`/v1/Download?downloadURL=${filenameUnknown}`)
      .reply(404, {})

    nock(`https://${config.middlewareEndpoint}`)
      .get(`/v2/search?query=${permitNumber}`)
      .reply(200, mockData)

    nock(`https://${config.middlewareEndpoint}`)
      .head(`/v2/search?query=${permitNumber}`)
      .reply(200)

    nock(`https://${config.middlewareEndpoint}`)
      .head('/v2/search?query=UNKNOWN_PERMIT_NUMBER')
      .reply(404)
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
      await expect(middlewareService.download(filenameUnknown)).rejects.toThrow(`Document ${filenameUnknown} not found`)
    })
  })

  describe('checkPermitExists method', () => {
    it('should return true if the permit exists', async () => {
      expect(middlewareService).toBeTruthy()
      const results = await middlewareService.checkPermitExists(permitNumber)
      expect(results).toBeTruthy()
    })

    it('should return false if the permit does not exist', async () => {
      expect(middlewareService).toBeTruthy()
      const results = await middlewareService.checkPermitExists('UNKNOWN_PERMIT_NUMBER')
      expect(results).toBeFalsy()
    })
  })

  describe('search method', () => {
    it('should return the correct results', async () => {
      expect(middlewareService).toBeTruthy()
      const permitData = await middlewareService.search(permitNumber)
      expect(permitData.result.items).toBeTruthy()
      expect(permitData.result.totalCount).toEqual(38)

      expect(permitData.result.items[0].permitDetails.activityGrouping).toEqual('Licence Supervision')
      expect(permitData.result.items[0].document.title).toEqual('CAR Form')
      expect(permitData.result.items[0].document.size).toEqual(89600)
      expect(permitData.result.items[0].document.uploadDate).toEqual('1985-10-29T00:00:00Z')
      expect(permitData.result.items[0].document.docLocation).toEqual('PublicRegister/00000013.msg')
    })
  })
})
