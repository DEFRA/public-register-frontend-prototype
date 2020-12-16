'use strict'

const moment = require('moment')
const { DATE_FORMAT_FULL } = require('../constants')

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

const formatTimestamp = date => {
  date = date || ''
  date = date
    .replace(/-/g, '/')
    .replace(/\./g, '/')
    .trim()
    .toLowerCase()

  if (date.match(/^[0-9]{4}$/)) {
    // 4-digit year supplied e.g. 2020
    date = `01/01/${date}`
  }

  date = moment(date, 'DD/MM/YYYY')
  return date.isValid() ? date.utc().format() : null
}

const formatExtension = extension => {
  if (extension) {
    extension = extension.replace(/\./g, '').toUpperCase()
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
  }
  return permitNumber
}

const _round = (value, precision) => {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

module.exports = {
  formatDate,
  formatTimestamp,
  formatExtension,
  formatFileSize,
  getContentType,
  sanitisePermitNumber
}
