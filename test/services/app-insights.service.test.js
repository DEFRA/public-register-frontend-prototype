'use strict'

jest.mock('applicationinsights')

const AppInsightsService = require('../../src/services/app-insights.service')
const applicationinsights = require('applicationinsights')

const appInsightsEvent = {
  name: 'KPI X - User has performed action Y',
  properties: { permitNumber: 'ABC', register: 'REGISTER', whatDoYouNeed: 'SOMETHING' }
}

const createMocks = () => {
  applicationinsights.setup = jest.fn(() => applicationinsights)
  applicationinsights.start = jest.fn()
  applicationinsights.defaultClient = {
    trackEvent: jest.fn()
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
      appInsightsService.trackEvent(appInsightsEvent)
      expect(appInsightsService.initialise).toBeCalledTimes(1)
      appInsightsService.trackEvent(appInsightsEvent)
      expect(appInsightsService.initialise).toBeCalledTimes(1)
    })
  })

  describe('trackEvent method', () => {
    it('should call the defaultClient trackEvent method', async () => {
      expect(appInsightsService).toBeTruthy()
      expect(applicationinsights.defaultClient.trackEvent).toBeCalledTimes(0)
      appInsightsService.trackEvent(appInsightsEvent)

      expect(applicationinsights.defaultClient.trackEvent).toBeCalledTimes(1)
    })
  })
})
