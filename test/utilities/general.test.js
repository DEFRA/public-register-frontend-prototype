'use strict'

const {
  formatDate,
  formatFileSize,
  getContentType,
  sanitisePermitNumber
} = require('../../src/utils/general')

describe('Utils / General', () => {
  describe('formatDate method', () => {
    it('should...', async () => {
      expect(formatDate('1985-10-29T00:00:00Z')).toEqual('29/10/1985')
    })
  })

  describe('formatFileSize method', () => {
    it('should format the file size correctly in KB when the file size is less than 1MB', async () => {
      expect(formatFileSize('0')).toEqual('0 KB')
      expect(formatFileSize('500000')).toEqual('500 KB')
      expect(formatFileSize('999000')).toEqual('999 KB')
    })

    it('should format the file size correctly in MB when the file size is 1MB or higher', async () => {
      expect(formatFileSize('1000000')).toEqual('1 MB')
      expect(formatFileSize('1010000')).toEqual('1.01 MB')
      expect(formatFileSize('1100000')).toEqual('1.1 MB')
      expect(formatFileSize('1110000')).toEqual('1.11 MB')
      expect(formatFileSize('1500000')).toEqual('1.5 MB')
    })
  })

  describe('getContentType method', () => {
    it('should get the correct content type', async () => {
      expect(getContentType('pdf')).toEqual('application/pdf')
    })
  })

  describe('sanitisePermitNumber method', () => {
    it('should remove all whitespace characters', async () => {
      expect(sanitisePermitNumber('  ABC\n123\t456  ')).toEqual('ABC123456')
    })

    it('should remove all forward slashes characters', async () => {
      expect(sanitisePermitNumber('ABC/123/456')).toEqual('ABC123456')
    })

    it('should remove all backslash characters', async () => {
      expect(sanitisePermitNumber('ABC\\123\\456')).toEqual('ABC123456')
    })

    it('should remove all dash characters', async () => {
      expect(sanitisePermitNumber('ABC-123-456')).toEqual('ABC123456')
    })

    it('should remove all dot characters', async () => {
      expect(sanitisePermitNumber('ABC.123.456')).toEqual('ABC123456')
    })
  })
})
