'use strict'

const nock = require('nock')

const MiddlewareService = require('../../src/services/middleware.service')
const mockData = require('../data/documents')

describe('Middleware service', () => {
  let middlewareService

  beforeEach(async () => {
    middlewareService = new MiddlewareService()

    nock('https://api.mantaqconsulting.co.uk')
      .post('/api/search')
      .reply(200, mockData)
  })

  afterEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  describe('search method', () => {
    it('should return the correct results', async () => {
      expect(middlewareService).toBeTruthy()
      const results = await middlewareService.search('4')

      expect(results.length).toEqual(1)
      expect(results[0].id).toEqual('4e0d1597-99a0-48ca-9d69-7c4b03509a1c')
    })
  })
})
