'use strict'

jest.mock('../../src/services/app-insights.service')
jest.mock('../../src/services/middleware.service')

const server = require('../../src/server')
const TestHelper = require('../utilities/test-helper')
const AppInsightsService = require('../../src/services/app-insights.service')
const MiddlewareService = require('../../src/services/middleware.service')

const mockAppInsightsService = require('../mocks/app-insights.service.mock')
const mockMiddlewareService = require('../mocks/middleware.service.mock')

function createMocks () {
  AppInsightsService.mockImplementation(() => mockAppInsightsService)
  MiddlewareService.mockImplementation(() => mockMiddlewareService)
}

describe('Enter Permit Number route', () => {
  const options = {
    method: 'GET',
    url: '/enter-permit-number'
  }

  const elementIDs = {
    yesOption: 'know-permit-number',
    noOption: 'know-permit-number-2',
    permitNumberField: 'permit-number',
    redirectionMessage: 'redirection-message',
    continueButton: 'continue-button'
  }

  let document

  beforeAll((done) => {
    createMocks()

    server.events.on('start', () => {
      done()
    })
  })

  afterAll((done) => {
    jest.clearAllMocks()

    server.events.on('stop', () => {
      done()
    })
    server.stop()
  })

  beforeEach(async () => {
    document = await TestHelper.submitRequest(server, options)
  })

  describe('Initialisation', () => {
    it('should have the Beta banner', async () => {
      TestHelper.checkBetaBanner(document)
    })

    it('should have the Back link', async () => {
      TestHelper.checkBackLink(document)
    })

    it('should display the correct question', async () => {
      const element = document.querySelector('.govuk-fieldset__legend')
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Do you know the permit number of the record you are looking for?')
    })

    it('should have the unselected "Yes" radio option', async () => {
      const element = document.querySelector(`#${elementIDs.yesOption}`)
      expect(element).toBeTruthy()
      expect(element.value).toEqual('yes')
      expect(element.checked).toBeFalsy()

      const elementLabel = document.querySelector(`label[for="${elementIDs.yesOption}"]`)
      expect(elementLabel).toBeTruthy()
      expect(TestHelper.getTextContent(elementLabel)).toEqual('Yes')
    })

    it('should have the unselected "No" radio option', async () => {
      const element = document.querySelector(`#${elementIDs.noOption}`)
      expect(element).toBeTruthy()
      expect(element.value).toEqual('no')
      expect(element.checked).toBeFalsy()

      const elementLabel = document.querySelector(`label[for="${elementIDs.noOption}"]`)
      expect(elementLabel).toBeTruthy()
      expect(TestHelper.getTextContent(elementLabel)).toEqual('No')
    })

    it('should have a hidden permit number field', async () => {
      const element = document.querySelector(`.govuk-radios__conditional--hidden #${elementIDs.permitNumberField}`)
      expect(element).toBeTruthy()
    })

    it('should have a hidden ePR redirection message', async () => {
      const element = document.querySelector(`.govuk-radios__conditional--hidden #${elementIDs.redirectionMessage}`)
      expect(element).toBeTruthy()
    })

    it('should have a Continue button', async () => {
      const element = document.querySelector(`#${elementIDs.continueButton}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Continue')
    })
  })

  describe('Behaviour', () => {
    describe('Yes selected', () => {
      it('should show the permit number field', async () => {
        // let element = document.querySelector(`.govuk-radios__conditional--hidden #${elementIDs.permitNumberField}`)
        // expect(element).toBeTruthy()

        // // const id = 'know-permit-number'
        // const yesOption = document.querySelector(`#${elementIDs.yesOption}`)
        // yesOption.click()

        // console.log(yesOption.click)

        // console.log('### before')
        // await TestHelper.wait(3000)
        // console.log('### after')

        // element = document.querySelector(`.govuk-radios__conditional--hidden #${elementIDs.permitNumberField}`)
        // expect(element).toBeFalsy()

        // const element = document.querySelector(`#${id}`)

        // const id = 'know-permit-number'
        // const element = document.querySelector(`#${id}`)
        // console.log(element.checked)
        // console.log('clicking')
        // element.click()
        // console.log(element.checked)
      })

      it('should hide the ePR redirection message', () => {

      })

      it('should progress to the next route when permit number is entered and the Continue button is pressed', () => {

      })
    })

    describe('No selected', () => {
      it('should show the ePR redirection message', () => {
        // id=redirection-message
        // 'You will be redirected to the Electronic Public Register search page to assist you in finding the record you are looking for'
      })

      it('should hide the permit number field', () => {

      })

      it('should redirect to ePR when the Continue button is pressed', () => {
        HTMLFormElement.prototype.submit = (params) => console.log(params) 

        const element = document.querySelector('#continue-button')
        element.click()

      // TODO mock HTMLFormElement.prototype.submit
      })
    })
  })

  describe('Validation', () => {
    it('should display a validation error message if the user does not select a Yes or No option', () => {
      const element = document.querySelector('#continue-button')
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Continue')

      // 'continue-button'
      // .error-summary-title
      // 'Fix the following errors'

      // .govuk-list govuk-error-summary__list > li > a
      // href = '#knowPermitNumber'

      // .know-permit-number-error
      // 'Select an option'
    })

    it('should display a validation error message if the Yes option is selected but the user enters a blank or whitespace-only permit number', () => {

    })

    it('should display a validation error message if the Yes option is selected but the user enters a permit number that is greater than the maximum length allowed', () => {

    })
  })
})
