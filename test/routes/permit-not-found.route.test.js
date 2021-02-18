'use strict'

const server = require('../../src/server')
const TestHelper = require('../utilities/test-helper')

describe('Permit not found route', () => {
  const permitNumber = 'ABC123'
  const register = 'Radioactive Substances'
  const url = `/permit-not-found?permitNumber=${permitNumber}&register=${register}`

  const elementIDs = {
    pageHeading: 'page-heading',
    permitNotFoundMessage: 'permit-not-found-message',
    permitNumber: 'permit-number',
    register: 'register'
  }

  let document

  beforeAll(done => {
    server.events.on('start', () => {
      done()
    })
  })

  afterAll(done => {
    server.events.on('stop', () => {
      done()
    })
    server.stop()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    const getOptions = {
      method: 'GET',
      url
    }

    beforeEach(async () => {
      document = await TestHelper.submitGetRequest(server, getOptions)
    })

    it('should have the Beta banner', () => {
      TestHelper.checkBetaBanner(document)
    })

    it('should not have the Back link', () => {
      TestHelper.checkBackLink(document, false)
    })

    it('should display the correct page heading', () => {
      const element = document.querySelector(`#${elementIDs.pageHeading}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Unable to find permit')
    })

    it('should show the permit number', async () => {
      const element = document.querySelector(`#${elementIDs.permitNumber}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual(permitNumber)
    })

    it('should show the register', async () => {
      const element = document.querySelector(`#${elementIDs.register}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual(register)
    })

    it('should have the "Permit not found" message', async () => {
      const element = document.querySelector(`#${elementIDs.permitNotFoundMessage}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual(`Permit number ${permitNumber} could not be found.`)
    })
  })
})
