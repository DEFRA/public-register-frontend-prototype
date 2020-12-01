'use strict'

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

const formatFileSize = (sizeInMB) => {
  return sizeInMB < 1 ? `${sizeInMB * 1000} ${KB}` : `${sizeInMB} ${MB}`
}

module.exports = {
  formatFileSize,
  getContentType
}
