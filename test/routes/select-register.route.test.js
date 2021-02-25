'use strict'

const server = require('../../src/server')

const TestHelper = require('../utilities/test-helper')

describe('Select Register route', () => {
  const url = '/select-register'
  const nextUrl = '/enter-permit-number'

  const elementIDs = {
    registerOption1: 'register',
    registerOption2: 'register-2',
    registerOption3: 'register-3',
    registerOption4: 'register-4',
    registerOption5: 'register-5',
    continueButton: 'continue-button'
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

    it('should have the Back link', () => {
      TestHelper.checkBackLink(document)
    })

    it('should display the correct question', () => {
      const element = document.querySelector('.govuk-fieldset__legend')
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('What activity would you like to search for documents?')
    })

    it('should have the correct radio options', () => {
      TestHelper.checkRadioOption(document, elementIDs.registerOption1, 'Waste Operations', 'Waste Operations', true)
      TestHelper.checkRadioOption(
        document,
        elementIDs.registerOption2,
        'Waste Operations',
        'End of Life Vehicles (ATF Register)',
        false
      )
      TestHelper.checkRadioOption(document, elementIDs.registerOption3, 'Installations', 'Installations', false)
      TestHelper.checkRadioOption(
        document,
        elementIDs.registerOption4,
        'Radioactive Substances',
        'Radioactive Substances',
        false
      )
      TestHelper.checkRadioOption(
        document,
        elementIDs.registerOption5,
        'Water Quality Discharge Consents',
        'Discharges to water and groundwater',
        false
      )
    })

    it('should have the correct Call-To-Action button', () => {
      const element = document.querySelector(`#${elementIDs.continueButton}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Continue')
    })
  })

  describe('POST', () => {
    let response
    let postOptions

    beforeEach(async () => {
      postOptions = {
        method: 'POST',
        url,
        payload: {
          register: 'Installations'
        }
      }
    })

    it('should progress to the next route when the permit number is known', async () => {
      response = await TestHelper.submitPostRequest(server, postOptions)

      expect(response.headers.location).toEqual(`${nextUrl}?register=Installations`)
    })
  })
})
