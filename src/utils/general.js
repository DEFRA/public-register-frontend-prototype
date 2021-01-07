'use strict'

const moment = require('moment')
moment.locale('en-GB')
const { DATE_FORMAT_DMY, DATE_FORMAT_FULL } = require('../constants')

const KB = 'KB'
const MB = 'MB'

const contentTypes = {
  msg: 'application/vnd.ms-outlook',
  pdf: 'application/pdf',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.preplyentationml.preplyentation',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  csv: 'application/octet-stream',
  xml: 'application/xml'
}

const getContentType = fileExtension => {
  return contentTypes[fileExtension]
}

const formatFileSize = size => {
  const KB_IN_BYTES = 1000
  const MB_IN_BYTES = 1000000

  return size < MB_IN_BYTES ? `${_round(size / KB_IN_BYTES, 0)} ${KB}` : `${_round(size / MB_IN_BYTES, 2)} ${MB}`
}

const formatDate = (date, format = DATE_FORMAT_FULL) => {
  // Date is in the following UTC format e.g. 1985-10-29T00:00:00Z
  return moment.utc(date).format(format)
}

const formatExtension = extension => {
  if (extension) {
    extension = extension
      .trim()
      .replace(/\./g, '')
      .toUpperCase()
  }
  return extension
}

const sanitisePermitNumber = permitNumber => {
  if (permitNumber) {
    permitNumber = permitNumber
      .replace(/\s/g, '')
      .replace(/\//g, '')
      .replace(/\\/g, '')
      .replace(/-/g, '')
      .replace(/\./g, '')
      .replace(/\./g, '')
  }
  return permitNumber
}

const validateDate = date => {
  const SEPARATOR = '/'
  const parsedDate = {
    originalDate: date,
    formattedDate: '',
    timestamp: null,
    isValid: true
  }

  date = date || ''
  date = date
    .trim()
    .replace(/-/g, SEPARATOR)
    .replace(/\./g, SEPARATOR)
    .replace(/\s+/g, SEPARATOR)
    .toLowerCase()
    .replace(/(january|jan)/g, '01')
    .replace(/(february|feb)/g, '02')
    .replace(/(march|mar)/g, '03')
    .replace(/(april|apr)/g, '04')
    .replace(/(may|may)/g, '05')
    .replace(/(june|jun)/g, '06')
    .replace(/(july|jul)/g, '07')
    .replace(/(august|aug)/g, '08')
    .replace(/(septempber|sept|sep)/g, '09')
    .replace(/(october|oct)/g, '10')
    .replace(/(november|nov)/g, '11')
    .replace(/(december|dec)/g, '12')

  if (date.length) {
    if (date.match(/^[0-9]{4}$/)) {
      // 4-digit year supplied e.g. 2020, set to first day of the year
      parsedDate.formattedDate = parsedDate.originalDate
      date = `01/01/${date}`
      parsedDate.timestamp = moment(date, DATE_FORMAT_DMY)
        .utc()
        .format()
      parsedDate.formattedDateDmy = moment(date, DATE_FORMAT_DMY).format(DATE_FORMAT_FULL)
    } else if (date.match(/^[0-9]{1,2}\/[0-9]{4}$/)) {
      // month and 4 digit year supplied e.g. 01/2020, set to first day of the month
      parsedDate.formattedDate = parsedDate.originalDate
      date = `01/${date}`
      parsedDate.timestamp = moment(date, DATE_FORMAT_DMY)
        .utc()
        .format()
      parsedDate.formattedDateDmy = moment(date, DATE_FORMAT_DMY).format(DATE_FORMAT_FULL)
    } else {
      if (date.match(/^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/)) {
        const dateMoment = moment(date, DATE_FORMAT_DMY)
        parsedDate.isValid = dateMoment.isValid()

        if (parsedDate.isValid) {
          parsedDate.formattedDate = dateMoment.format(DATE_FORMAT_DMY)
          parsedDate.timestamp = dateMoment.utc().format()
          parsedDate.formattedDateDmy = dateMoment.format(DATE_FORMAT_FULL)
        }
      } else {
        parsedDate.formattedDate = parsedDate.originalDate
        parsedDate.isValid = false
      }
    }
  }
  return parsedDate
}

const _round = (value, precision) => {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

module.exports = {
  formatDate,
  formatExtension,
  formatFileSize,
  getContentType,
  sanitisePermitNumber,
  validateDate
}
