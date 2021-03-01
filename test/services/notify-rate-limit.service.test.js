'use strict'

const NotifyRateLimitService = require('../../src/services/notify-rate-limit.service')

const createMocks = () => {
  Date.now = jest.fn(() => new Date('2021-03-31T12:00:00'))
}

const DEFAULT_NOTIFY_RATE_RATE_LIMIT = 400

describe('Notify rate limit service', () => {
  let notifyRateLimitService

  beforeEach(() => {
    createMocks()
    notifyRateLimitService = new NotifyRateLimitService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('registerNotifyMessages method', () => {
    it('should register the messages if the rate limit has not been reached', () => {
      expect(notifyRateLimitService.registerNotifyMessages(2)).toBeTruthy()
    })

    it('should not register the messages if the limit has been reached', () => {
      expect(notifyRateLimitService.registerNotifyMessages(DEFAULT_NOTIFY_RATE_RATE_LIMIT + 1)).toBeFalsy()
    })

    it('should reset the rate limit after an hour or more has elapsed', () => {
      expect(notifyRateLimitService.registerNotifyMessages(DEFAULT_NOTIFY_RATE_RATE_LIMIT)).toBeTruthy()
      expect(notifyRateLimitService.registerNotifyMessages(1)).toBeFalsy()

      Date.now = jest.fn(() => new Date('2021-03-31T13:00:01'))
      expect(notifyRateLimitService.registerNotifyMessages(1)).toBeTruthy()
    })
  })
})
