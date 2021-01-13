'use strict'

const { v4: uuidv4 } = require('uuid')
const { logger } = require('defra-logging-facade')

const config = require('../config/config')

const NotifyClient = require('notifications-node-client').NotifyClient
let notifyClient

class NotificationService {
  _initialise () {
    notifyClient = new NotifyClient(config.govNotifyKey)

    this.isInitialised = true
  }

  async sendMessage (emailAddress, message) {
    if (!this.isInitialised) {
      this._initialise()
    }

    const templateId = 'd2d00fd9-e685-47a3-bd14-415122c54229'

    const personalisation = {
      message,
      timescale: config.documentRequestTimescale
    }
    const reference = uuidv4()
    const emailReplyToId = null

    try {
      logger.info(`Sending document request ID: ${templateId} request: ${message}`)

      const response = await notifyClient.sendEmail(templateId, emailAddress, {
        personalisation,
        reference,
        emailReplyToId
      })

      return response
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = NotificationService
