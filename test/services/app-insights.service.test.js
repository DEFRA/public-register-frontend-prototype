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
    })
  })

  describe('trackEvent method', () => {
    it('should ...', async () => {
      expect(appInsightsService).toBeTruthy()
      appInsightsService.trackEvent()
    })
  })

  describe('trackMetric method ...', () => {
    it('should ...', async () => {
      expect(appInsightsService).toBeTruthy()

      appInsightsService.trackMetric()
    })
  })
})
