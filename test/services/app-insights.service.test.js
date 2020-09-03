'use strict'

jest.mock('applicationinsights')

const AppInsightsService = require('../../src/services/app-insights.service')
const applicationinsights = require('applicationinsights')

function createMocks () {
  applicationinsights.setup = jest.fn(() => applicationinsights)
  applicationinsights.start = jest.fn()
  applicationinsights.defaultClient = {
    trackEvent: jest.fn(),
    trackMetric: jest.fn()
  }
}

describe('AppInsights service', () => {
  let appInsightsService

  beforeEach(async () => {
    createMocks()

    appInsightsService = new AppInsightsService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('initialise method', () => {
    it('should only be called once', async () => {
      expect(appInsightsService).toBeTruthy()
      jest.spyOn(appInsightsService, 'initialise')
      expect(appInsightsService.initialise).toBeCalledTimes(0)
      appInsightsService.trackEvent()
      expect(appInsightsService.initialise).toBeCalledTimes(1)
      appInsightsService.trackEvent()
      expect(appInsightsService.initialise).toBeCalledTimes(1)
    })
  })

  describe('trackEvent method', () => {
    it('should call the defaultClient trackEvent method', async () => {
      expect(appInsightsService).toBeTruthy()
      expect(applicationinsights.defaultClient.trackEvent).toBeCalledTimes(0)
      appInsightsService.trackEvent()
      expect(applicationinsights.defaultClient.trackEvent).toBeCalledTimes(1)
    })
  })

  describe('trackMetric method', () => {
    it('should call the defaultClient trackMetric method', async () => {
      expect(appInsightsService).toBeTruthy()
      expect(applicationinsights.defaultClient.trackMetric).toBeCalledTimes(0)
      appInsightsService.trackMetric()
      expect(applicationinsights.defaultClient.trackMetric).toBeCalledTimes(1)
    })
  })
})
