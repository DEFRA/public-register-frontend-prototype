'use strict'

const {
  formatDate,
  formatExtension,
  formatFileSize,
  getContentType,
  sanitisePermitNumber,
  validateDate
} = require('../../src/utils/general')

describe('Utils / General', () => {
  describe('formatDate method', () => {
    it('should format dates correctly', async () => {
      expect(formatDate('1985-10-29T00:00:00Z')).toEqual('29th October 1985')
    })
  })

  describe('formatExtension method', () => {
    it('should format file extensions correctly', async () => {
      expect(formatExtension('   .pdf   ')).toEqual('PDF')
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

  describe('validateDate method', () => {
    it('should validate and format dates correctly', async () => {
      expect(validateDate('')).toEqual({ formattedDate: '', isValid: true, originalDate: '', timestamp: null })

      expect(validateDate('jan 2020')).toEqual({
        formattedDate: 'jan 2020',
        formattedDateDmy: '1st January 2020',
        isValid: true,
        originalDate: 'jan 2020',
        timestamp: '2020-01-01T00:00:00Z'
      })

      expect(validateDate('1 jan 2020')).toEqual({
        formattedDate: '01/01/2020',
        formattedDateDmy: '1st January 2020',
        isValid: true,
        originalDate: '1 jan 2020',
        timestamp: '2020-01-01T00:00:00Z'
      })

      expect(validateDate('2004')).toEqual({
        formattedDate: '2004',
        formattedDateDmy: '1st January 2004',

        isValid: true,
        originalDate: '2004',
        timestamp: '2004-01-01T00:00:00Z'
      })

      expect(validateDate('01 2005')).toEqual({
        formattedDate: '01 2005',
        formattedDateDmy: '1st January 2005',
        isValid: true,
        originalDate: '01 2005',
        timestamp: '2005-01-01T00:00:00Z'
      })

      expect(validateDate('01/2005')).toEqual({
        formattedDate: '01/2005',
        formattedDateDmy: '1st January 2005',
        isValid: true,
        originalDate: '01/2005',
        timestamp: '2005-01-01T00:00:00Z'
      })

      expect(validateDate('  2/3/2006  ')).toEqual({
        formattedDate: '02/03/2006',
        formattedDateDmy: '2nd March 2006',
        isValid: true,
        originalDate: '  2/3/2006  ',
        timestamp: '2006-03-02T00:00:00Z'
      })

      expect(validateDate('XXXXX')).toEqual({
        formattedDate: 'XXXXX',
        isValid: false,
        originalDate: 'XXXXX',
        timestamp: null
      })
    })
  })
})
