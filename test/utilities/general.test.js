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
    it('should format dates correctly', () => {
      expect(formatDate('1985-10-29T00:00:00Z')).toEqual('29th October 1985')
    })
  })

  describe('formatExtension method', () => {
    it('should format file extensions correctly', () => {
      expect(formatExtension('   .pdf   ')).toEqual('PDF')
    })
  })

  describe('formatFileSize method', () => {
    it('should format the file size correctly in KB when the file size is less than 1MB', () => {
      expect(formatFileSize('0')).toEqual('0 KB')
      expect(formatFileSize('500000')).toEqual('500 KB')
      expect(formatFileSize('999000')).toEqual('999 KB')
    })

    it('should format the file size correctly in MB when the file size is 1MB or higher', () => {
      expect(formatFileSize('1000000')).toEqual('1 MB')
      expect(formatFileSize('1010000')).toEqual('1.01 MB')
      expect(formatFileSize('1100000')).toEqual('1.1 MB')
      expect(formatFileSize('1110000')).toEqual('1.11 MB')
      expect(formatFileSize('1500000')).toEqual('1.5 MB')
    })
  })

  describe('getContentType method', () => {
    it('should get the correct content type', () => {
      expect(getContentType('pdf')).toEqual('application/pdf')
    })
  })

  describe('sanitisePermitNumber method', () => {
    describe('Waste Operations (including End of Life Vehicles) registers', () => {
      const expectedPermitNumer = 'EAWML 123456'
      const expectedEprPermitNumer = 'EPR-AB12CD'
      const registers = ['Waste Operations']

      it('should strip a suffix', () => {
        registers.forEach(register =>
          expect(sanitisePermitNumber(register, 'EAWML 123456/A001')).toEqual(expectedPermitNumer)
        )
      })

      it('should convert to upper case', () => {
        registers.forEach(register =>
          expect(sanitisePermitNumber(register, 'eawml 123456')).toEqual(expectedPermitNumer)
        )
      })

      it('should strip all non-alphanumeric characters', () => {
        registers.forEach(register =>
          expect(sanitisePermitNumber(register, ' EAWML\n123\t456  !@£$%^&*(/:"<>?')).toEqual('EAWML 123456')
        )
      })

      it('should add a space for EAWML permit numbers', () => {
        registers.forEach(register => expect(sanitisePermitNumber(register, 'EAWML123456')).toEqual('EAWML 123456'))
      })

      it('should add a hyphen for EPR permit numbers', () => {
        registers.forEach(register =>
          expect(sanitisePermitNumber(register, 'EPRAB12CD')).toEqual(expectedEprPermitNumer)
        )
      })

      it('should add "EAWML " prefix to the permit number if the permit number only contains numeric characters', () => {
        registers.forEach(register => expect(sanitisePermitNumber(register, '123456')).toEqual(expectedPermitNumer))
      })

      it('should add "EPR-" prefix to the permit number if the permit number only contains alphanumeric characters', () => {
        registers.forEach(register => expect(sanitisePermitNumber(register, 'AB12CD')).toEqual(expectedEprPermitNumer))
      })
    })

    describe('Installations and Radioactive Substances registers', () => {
      const expectedEprPermitNumer = 'EPR-AB12CD'
      const registers = ['Installations', 'Radioactive Substances']

      it('should strip all non-alphanumeric characters', () => {
        registers.forEach(register =>
          expect(sanitisePermitNumber(register, ' EPR-AB\n12\t.CD  !@£$%^&*(/:"<>?')).toEqual(expectedEprPermitNumer)
        )
      })

      it('should add a hyphen for EPR permit numbers', () => {
        registers.forEach(register =>
          expect(sanitisePermitNumber(register, 'EPRAB12CD')).toEqual(expectedEprPermitNumer)
        )
      })

      it('should add "EPR-" prefix to the permit number if the permit number only contains alphanumeric characters', () => {
        registers.forEach(register => expect(sanitisePermitNumber(register, 'AB12CD')).toEqual(expectedEprPermitNumer))
      })
    })

    describe('Discharges to water and groundwater (Water Quality Discharge Consents)', () => {
      const register = 'Water Quality Discharge Consents'
      const expectedPermitNumer = 'EPR-AB1234CD'
      it('should strip off the prefix and suffix (keep everything inbetween the first and last first forward slash characters)', () => {
        expect(sanitisePermitNumber(register, '123-ABC/EPR-AB1234CD/456-DEF')).toEqual(expectedPermitNumer)
      })

      it('should remove all whitespace characters', () => {
        expect(sanitisePermitNumber(register, ' \t 123 / EPR - AB12 \t\n34CD / 456 \t  ')).toEqual(expectedPermitNumer)
      })

      it('should convert to upper case', () => {
        expect(sanitisePermitNumber(register, 'epr-ab1234cd')).toEqual(expectedPermitNumer)
      })

      it('should replace all non-alphanumeric chracters with -', () => {
        expect(sanitisePermitNumber(register, 'A/B=C.D-E|F/G')).toEqual('B-C-D-E-F')
      })

      it("should add a hyphen after the EPR prefix if it doesn't already have one", () => {
        expect(sanitisePermitNumber(register, 'EPRAB1234CD')).toEqual(expectedPermitNumer)
      })
    })
  })

  describe('validateDate method', () => {
    it('should validate and format dates correctly', () => {
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
