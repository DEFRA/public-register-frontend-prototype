'use strict'

const moment = require('moment')

const config = require('../config/config')

class NotifyRateLimitService {
  constructor () {
    this._setLimitExpiry(moment())
  }

  registerNotifyMessages (messageCount) {
    this._checkLimitExpiry()

    return this._decrement(messageCount)
  }

  _decrement (messageCount) {
    let messagesAllowed = false
    if (this.remainingMessages >= messageCount) {
      this.remainingMessages -= messageCount
      messagesAllowed = true
    }

    return messagesAllowed
  }

  _checkLimitExpiry () {
    const now = moment()

    if (now.isAfter(this.limitExpiry)) {
      this._setLimitExpiry(now)
    }
  }

  _setLimitExpiry (dateMoment) {
    this.remainingMessages = parseInt(config.govNotifyRateLimit)

    this.limitExpiry = dateMoment.add(1, 'hours')
  }
}

module.exports = NotifyRateLimitService
