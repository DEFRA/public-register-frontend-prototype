'use strict'

jest.mock('notifications-node-client')
const NotifyClient = require('notifications-node-client').NotifyClient

const NotificationService = require('../../src/services/notification.service')

const createMocks = () => {
  NotifyClient.prototype.sendEmail = jest.fn()
}

const data = {
  permitDetails: {
    permitNumber: 'EAWML65519',
    site: 'Site On Trevor Street',
    register: 'Water Discharges',
    address: '3 Trevor Street Hull Humberside',
    postcode: 'HU2 0HR'
  },
  whatDoYouNeed: 'documentQuestion',
  furtherInformation: 'test',
  email: 'customer@somewhere.com',
  maxlength: 5000,
  timescale: 20
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
      notificationService.sendCustomerEmail(data)
      expect(notificationService._initialise).toBeCalledTimes(1)
      notificationService.sendNcccEmail(data)
      expect(notificationService._initialise).toBeCalledTimes(1)
    })
  })

  describe('sendCustomerEmail method', () => {
    it('should call the Notify sendEmail method', () => {
      expect(notificationService).toBeTruthy()

      expect(NotifyClient.prototype.sendEmail).toBeCalledTimes(0)
      notificationService.sendCustomerEmail(data)
      expect(NotifyClient.prototype.sendEmail).toBeCalledTimes(1)
    })
  })

  describe('sendNcccEmail method', () => {
    it('should call the Notify sendEmail method', async () => {
      expect(notificationService).toBeTruthy()

      expect(NotifyClient.prototype.sendEmail).toBeCalledTimes(0)
      notificationService.sendNcccEmail(data)
      expect(NotifyClient.prototype.sendEmail).toBeCalledTimes(1)
    })
  })
})
