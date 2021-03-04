'use strict'

const moment = require('moment')
moment.locale('en-GB')

const { Registers, DATE_FORMAT_DMY, DATE_FORMAT_FULL } = require('../constants')

const KB = 'KB'
const MB = 'MB'

const eawmlPrefix = 'EAWML '
const eprPrefix = 'EPR-'

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

const sanitisePermitNumber = (register, permitNumber) => {
  if (register === Registers.WASTE_OPERATIONS) {
    // Strip off the suffix (everything after and including the last forward slash character)
    permitNumber = permitNumber.replace(/\/.*$/g, '')

    // Convert to upper case
    permitNumber = permitNumber.toUpperCase()

    // Strip off all non-alphanumeric characters
    permitNumber = permitNumber.replace(/[^A-Z0-9/]/g, '')

    if (permitNumber.match(/^EAWML/g)) {
      // Add a space after the EAWML prefix
      permitNumber = permitNumber.replace(/^EAWML/g, eawmlPrefix)
    } else if (permitNumber.match(/^EPR/g)) {
      // Add a hyphen after the EPR prefix
      permitNumber = permitNumber.replace(/^EPR/g, eprPrefix)
    } else if (permitNumber.match(/^[0-9]*$/g)) {
      // Add a EAWML prefix if the permit number is only numeric
      permitNumber = `${eawmlPrefix}${permitNumber}`
    } else if (permitNumber.match(/^[A-Z0-9]*$/g)) {
      // Add an EPR- prefix if the permit number is alphanumeric
      permitNumber = `${eprPrefix}${permitNumber}`
    }
  } else if (register === Registers.INSTALLATIONS || register === Registers.RADIOACTIVE_SUBSTANCES) {
    // Convert to upper case
    permitNumber = permitNumber.toUpperCase()

    // Strip off all non-alphanumeric characters
    permitNumber = permitNumber.replace(/[^A-Z0-9]/g, '')

    if (permitNumber.match(/^EPR/g)) {
      // Add a hyphen after the EPR prefix
      permitNumber = permitNumber.replace(/^EPR/g, eprPrefix)
    } else if (permitNumber.match(/^[A-Z0-9]*$/g)) {
      // Add an EPR- prefix if the permit number is alphanumeric
      permitNumber = `${eprPrefix}${permitNumber}`
    }
  } else if (register === Registers.DISCHARGES_TO_WATER_AND_GROUNDWATER) {
    // Strip off the prefix (everything up to including the first forward slash character)
    permitNumber = permitNumber.replace(/^[^/]*\//g, '')

    // Strip off the suffix (everything after and including the last forward slash character)
    const index = permitNumber.lastIndexOf('/')
    if (index !== -1) {
      permitNumber = permitNumber.substring(0, permitNumber.lastIndexOf('/'))
    }

    // Remove all whitespace
    permitNumber = permitNumber.replace(/\s/g, '')

    // Convert to upper case
    permitNumber = permitNumber.toUpperCase()

    // Replace all non-alphanumeric chracters with -
    permitNumber = permitNumber.replace(/[^A-Z0-9]/g, '-')

    // Add a hyphen after the EPR prefix if it doesn't already have one
    if (permitNumber.match(/^EPR/g) && !permitNumber.match(/^EPR-/g)) {
      permitNumber = permitNumber.replace(/^EPR/g, eprPrefix)
    }
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
