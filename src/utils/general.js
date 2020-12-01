'use strict'

const moment = require('moment')
const { DATE_FORMAT } = require('../constants')

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

const getContentType = (fileExtension) => {
  return contentTypes[fileExtension]
}

const formatFileSize = (size) => {
  const KB_IN_BYTES = 1024
  const MB_IN_BYTES = 1048576

  return size < MB_IN_BYTES ? `${_round(size / KB_IN_BYTES, 0)} ${KB}` : `${_round(size / MB_IN_BYTES, 1)} ${MB}`
}

const formatDate = (date) => {
  // Date is in the following UTC format e.g. 1985-10-29T00:00:00Z
  return moment.utc(date).format(DATE_FORMAT)
}

const _round = (value, precision) => {
  const multiplier = Math.pow(10, precision || 0)
  return Math.round(value * multiplier) / multiplier
}

module.exports = {
  formatDate,
  formatFileSize,
  getContentType
}
