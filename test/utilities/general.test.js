'use strict'

const { formatFileSize, getContentType } = require('../../src/utils/general')

describe('Utils / General', () => {
  describe('formatFileSize method', () => {
    it('should format the file size correctly when the file size is less than 1MB', async () => {
      expect(formatFileSize('0')).toEqual('0 KB')
      expect(formatFileSize('0.5')).toEqual('500 KB')
      expect(formatFileSize('0.999')).toEqual('999 KB')
    })

    it('should format the file size correctly when the file size is 1MB or higher', async () => {
      expect(formatFileSize('1')).toEqual('1 MB')
      expect(formatFileSize('1.001')).toEqual('1.001 MB')
      expect(formatFileSize('1.01')).toEqual('1.01 MB')
      expect(formatFileSize('1.1')).toEqual('1.1 MB')
      expect(formatFileSize('1.5')).toEqual('1.5 MB')
    })
  })

  describe('getContentType method', () => {
    it('should get the correct content type', async () => {
      expect(getContentType('pdf')).toEqual('application/pdf')
    })
  })
})
