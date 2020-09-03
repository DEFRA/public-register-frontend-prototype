'use strict'

const appInsightsService = require('../../src/services/app-insights.service')

describe('AppInsights service', () => {
  // let middlewareService

  beforeEach(async () => {
    // middlewareService = new MiddlewareService()
  })

  afterEach(async () => {
  })

  describe('trackEvent method', () => {
    it('should ...', async () => {
      // const result = await middlewareService.getData()
      // console.log(result)

      expect(appInsightsService).toBeTruthy()
    })
  })

  describe('trackMetric method ...', () => {
    it('should ...', async () => {
      // const result = await middlewareService.getData()
      // console.log(result)
      expect(appInsightsService).toBeTruthy()

      // expect(true).toBeTruthy()
    })
  })
})
