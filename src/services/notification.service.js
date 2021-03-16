'use strict'

const { v4: uuidv4 } = require('uuid')
const { logger } = require('defra-logging-facade')

const config = require('../config/config')

const NotifyClient = require('notifications-node-client').NotifyClient
let notifyClient

const whatDoYouNeedLookup = {
  locateDocument: "I can't find the documents I need",
  documentQuestion: 'I have a question about one of the documents',
  permitEnquiry: 'I have an enquiry about the permit'
}

class NotificationService {
  _initialise () {
    notifyClient = new NotifyClient(config.govNotifyKey)
    this.isInitialised = true
  }

  sendCustomerEmail (data) {
    const templateId = data.isSearchMode ? config.customerEmailSearchModeTemplateId : config.customerEmailTemplateId
    this._sendMessage(templateId, data.email, data)
  }

  sendNcccEmail (data) {
    const templateId = data.isSearchMode ? config.ncccEmailSearchModeTemplateId : config.ncccEmailTemplateId
    this._sendMessage(templateId, config.ncccEmail, data)
  }

  _sendMessage (templateId, recipientEmail, data) {
    if (!this.isInitialised) {
      this._initialise()
    }
    const personalisation = {
      isSearchMode: data.isSearchMode,
      customerEmail: data.email,
      permitNumber: data.permitDetails.permitNumber,
      site: data.permitDetails.site,
      register: data.permitDetails.register,
      address: data.permitDetails.address,
      postcode: data.permitDetails.postcode,
      whatDoYouNeed: whatDoYouNeedLookup[data.whatDoYouNeed],
      furtherInformation: data.furtherInformation,
      timescale: config.informationRequestTimescale
    }
    const reference = uuidv4()
    const emailReplyToId = null
    try {
      logger.info(
        `Sending document request ID: [${reference}] to email: [${recipientEmail}] using template ID :[${templateId}] for permit number: [${personalisation.permitNumber}] furtherInformation: [${personalisation.furtherInformation}]`
      )
      notifyClient.sendEmail(templateId, recipientEmail, {
        personalisation,
        reference,
        emailReplyToId
      })
    } catch (error) {
      logger.error(`Error sending message [${reference}]`, error)
    }
  }
}

module.exports = NotificationService
