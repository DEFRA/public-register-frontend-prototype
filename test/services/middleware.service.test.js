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
      .get(`/Download?downloadURL=${filename}`)
      .reply(200, {})

    nock(`https://${config.middlewareEndpoint}`)
      .get(`/Download?downloadURL=${filenameUnknown}`)
      .reply(404, {})

    nock(`https://${config.middlewareEndpoint}`)
      .get(`/Search?permitNumber=${permitNumber}`)
      .reply(200, mockData)
  })

  afterEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
  })

  describe('/Download method', () => {
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

  describe('/Search method', () => {
    it('should return the correct results', async () => {
      expect(middlewareService).toBeTruthy()
      const permitData = await middlewareService.search(permitNumber)
      expect(permitData.result.documents).toBeTruthy()
      expect(permitData.result.documents.length).toEqual(38)

      expect(permitData.result.documents[0].title).toEqual('Compliance Returns Correspondence Apr to Jun 2016 Rejected')
      expect(permitData.result.documents[0].fileType).toBeNull()
      expect(permitData.result.documents[0].fileSize).toEqual(0.001)
      expect(permitData.result.documents[0].activityGrouping).toEqual('Waste Returns')
      expect(permitData.result.documents[0].uploadedDate).toEqual('12/10/1985')
      expect(permitData.result.documents[0].downloadURL).toEqual('PublicRegister-Dummy/00000001.msg')
    })
  })
})
