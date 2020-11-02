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
      await middlewareService.search('ABC123/45')
      const results = await middlewareService.search('ABC123/45')
      expect(results.documents).toBeTruthy()
      expect(results.documents.length).toEqual(3)

      // TODO Check response
      // expect(results[0].id).toEqual('4e0d1597-99a0-48ca-9d69-7c4b03509a1c')
    })
  })
})
