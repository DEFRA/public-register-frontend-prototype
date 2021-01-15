'use strict'

jest.mock('notifications-node-client')
const NotifyClient = require('notifications-node-client').NotifyClient

const NotificationService = require('../../src/services/notification.service')

const createMocks = () => {
  NotifyClient.prototype.sendEmail = jest.fn()
}

describe('Notification service', () => {
  let notificationService

  beforeEach(async () => {
    createMocks()

    notificationService = new NotificationService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('initialise method', () => {
    it('should only be called once', async () => {
      expect(notificationService).toBeTruthy()
      jest.spyOn(notificationService, '_initialise')
      expect(notificationService._initialise).toBeCalledTimes(0)
      notificationService.sendCustomerEmail()
      expect(notificationService._initialise).toBeCalledTimes(1)
      notificationService.sendNcccEmail()
      expect(notificationService._initialise).toBeCalledTimes(1)
    })
  })

  describe('sendCustomerEmail method', () => {
    it('should call the Notify sendEmail method', () => {
      expect(notificationService).toBeTruthy()

      expect(NotifyClient.prototype.sendEmail).toBeCalledTimes(0)
      notificationService.sendCustomerEmail()
      expect(NotifyClient.prototype.sendEmail).toBeCalledTimes(1)
    })
  })

  describe('sendNcccEmail method', () => {
    it('should call the Notify sendEmail method', async () => {
      expect(notificationService).toBeTruthy()

      expect(NotifyClient.prototype.sendEmail).toBeCalledTimes(0)
      notificationService.sendNcccEmail()
      expect(NotifyClient.prototype.sendEmail).toBeCalledTimes(1)
    })
  })
})
