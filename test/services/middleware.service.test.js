'use strict'

const nock = require('nock')

const MiddlewareService = require('../../src/services/middleware.service')
const mockData = require('../data/permit-data')
const MIDDLEWARE_ENDPOINT = 'https://api.mantaqconsulting.co.uk'

describe('Middleware service', () => {
  let middlewareService

  beforeEach(async () => {
    middlewareService = new MiddlewareService()

    nock(MIDDLEWARE_ENDPOINT)
      .get('/api/v1/Download/XXX123')
      .reply(200, mockData)

    nock(MIDDLEWARE_ENDPOINT)
      .get('/api/v1/Search')
      .reply(200, {})
  })

  afterEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  describe('/Download method', () => {
    it('should return the correct results', async () => {
      expect(middlewareService).toBeTruthy()
      const results = await middlewareService.download('XXX123')
      expect(results).toBeTruthy()
    })
  })

  describe('/Search method', () => {
    it('should return the correct results', async () => {
      expect(middlewareService).toBeTruthy()
      const permitData = await middlewareService.search('EAWML65519')
      expect(permitData.result.documents).toBeTruthy()
      expect(permitData.result.documents.length).toEqual(38)

      expect(permitData.result.documents[0].title).toEqual('Compliance Returns Correspondence Apr to Jun 2016 Rejected')
      expect(permitData.result.documents[0].fileType).toBeNull()
      expect(permitData.result.documents[0].fileSize).toEqual(10)
      expect(permitData.result.documents[0].activityGrouping).toEqual('Waste Returns')
      expect(permitData.result.documents[0].uploadedDate).toEqual('12/10/1985')
      expect(permitData.result.documents[0].downloadURL).toEqual('PublicRegister-Dummy/00000001.msg')
    })
  })
})
