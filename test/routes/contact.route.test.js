'use strict'

const server = require('../../src/server')

jest.mock('../../src/services/notification.service')
const NotificationService = require('../../src/services/notification.service')

jest.mock('../../src/services/app-insights.service')
const AppInsightsService = require('../../src/services/app-insights.service')

const TestHelper = require('../utilities/test-helper')

describe('Contact route', () => {
  const url =
    '/contact?permitNumber=EAWML 65519&site=Site%20On%20Trevor%20Street&register=Installations&address=3%20Trevor%20Street%20Hull%20Humberside&postcode=HU2%200HR'
  const nextUrl = '/contact-complete'
  const FURTHER_INFO_CHARACTER_LIMIT = 5000

  const elementIDs = {
    summaryList: {
      permitKey: 'summary-list-permit-key',
      permitValue: 'summary-list-permit-value',
      siteKey: 'summary-list-site-key',
      siteValue: 'summary-list-site-value',
      registerKey: 'summary-list-register-key',
      registerValue: 'summary-list-register-value',
      addressKey: 'summary-list-address-key',
      addressValue: 'summary-list-address-value',
      postcodeKey: 'summary-list-postcode-key',
      postcodeValue: 'summary-list-postcode-value'
    },
    whatDoYouNeedOptions: {
      locateDocument: 'whatDoYouNeed',
      documentQuestion: 'whatDoYouNeed-2',
      permitEnquiry: 'whatDoYouNeed-3'
    },
    pageHeading: 'page-heading',
    furtherInformation: 'furtherInformation',
    furtherInformationInfo: 'furtherInformation-info',
    email: 'email',
    emailHint: 'email-hint',
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

  beforeEach(() => {
    server.methods.registerNotifyMessages = jest.fn().mockReturnValue(true)
    NotificationService.prototype.sendCustomerEmail = jest.fn()
    NotificationService.prototype.sendNcccEmail = jest.fn()
    AppInsightsService.prototype.trackEvent = jest.fn()
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

    it('should display the correct page heading', () => {
      const element = document.querySelector(`#${elementIDs.pageHeading}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Request further information about this permit')
    })

    it('should display the permit summary details', () => {
      let element = document.querySelector(`#${elementIDs.summaryList.permitKey}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Permit')

      element = document.querySelector(`#${elementIDs.summaryList.permitValue}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('EAWML 65519')

      element = document.querySelector(`#${elementIDs.summaryList.siteKey}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Facility name')

      element = document.querySelector(`#${elementIDs.summaryList.siteValue}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Site On Trevor Street')

      element = document.querySelector(`#${elementIDs.summaryList.registerKey}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Register')

      element = document.querySelector(`#${elementIDs.summaryList.registerValue}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Installations')

      element = document.querySelector(`#${elementIDs.summaryList.addressKey}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Address')

      element = document.querySelector(`#${elementIDs.summaryList.addressValue}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('3 Trevor Street Hull Humberside')

      element = document.querySelector(`#${elementIDs.summaryList.postcodeKey}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Postcode')

      element = document.querySelector(`#${elementIDs.summaryList.postcodeValue}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('HU2 0HR')
    })

    it('should have the unselected "Cant find" radio option', () => {
      TestHelper.checkRadioOption(
        document,
        elementIDs.whatDoYouNeedOptions.locateDocument,
        'locateDocument',
        "I can't find the document(s) I need"
      )
    })

    it('should have the unselected "Question" radio option', () => {
      TestHelper.checkRadioOption(
        document,
        elementIDs.whatDoYouNeedOptions.documentQuestion,
        'documentQuestion',
        'I have a question about one of the documents'
      )
    })

    it('should have the unselected "Permit enquiry" radio option', () => {
      TestHelper.checkRadioOption(
        document,
        elementIDs.whatDoYouNeedOptions.permitEnquiry,
        'permitEnquiry',
        'I have an enquiry about the permit'
      )
    })

    it('should display the "Further information" form field', () => {
      let element = document.querySelector(`#${elementIDs.furtherInformationInfo}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual(
        `You can enter up to ${FURTHER_INFO_CHARACTER_LIMIT} characters`
      )

      element = document.querySelector('[for="furtherInformation"]')
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Please provide further information')

      element = document.querySelector(`#${elementIDs.furtherInformation}`)
      expect(element).toBeTruthy()
    })

    it('should display the "Email" form field', () => {
      let element = document.querySelector('[for="email"]')
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Email address')

      element = document.querySelector(`#${elementIDs.email}`)
      expect(element).toBeTruthy()

      element = document.querySelector(`#${elementIDs.emailHint}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('We will send responses to this address')

      element = document.querySelector(`#${elementIDs.continueButton}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Continue')
    })
  })

  describe('POST', () => {
    let response
    let postOptions

    beforeEach(() => {
      postOptions = {
        method: 'POST',
        url,
        payload: {}
      }
    })

    describe('Success', () => {
      it('should send messages and progress to the next route when the document request and email have been entered correctly', async () => {
        postOptions.payload.whatDoYouNeed = 'locateDocument'
        postOptions.payload.furtherInformation = 'the request details'
        postOptions.payload.email = 'someone@somewhere.com'

        expect(NotificationService.prototype.sendCustomerEmail).toBeCalledTimes(0)
        expect(NotificationService.prototype.sendNcccEmail).toBeCalledTimes(0)

        response = await TestHelper.submitPostRequest(server, postOptions)

        expect(NotificationService.prototype.sendCustomerEmail).toBeCalledTimes(1)
        expect(NotificationService.prototype.sendNcccEmail).toBeCalledTimes(1)

        expect(response.headers.location).toEqual(`${nextUrl}?email=someone%40somewhere.com`)
      })
    })

    describe('Failure', () => {
      const VALIDATION_SUMMARY_HEADING = 'There is a problem'

      describe('Document request details', () => {
        it('should display a validation error message if the user does not specify what they need', async () => {
          postOptions.payload.whatDoYouNeed = ''
          postOptions.payload.email = 'someone@somewhere.com'
          postOptions.payload.furtherInformation = 'the request details'
          response = await TestHelper.submitPostRequest(server, postOptions, 400)
          await TestHelper.checkValidationError(
            response,
            'whatDoYouNeed',
            'whatDoYouNeed-error',
            VALIDATION_SUMMARY_HEADING,
            'Select an option'
          )
        })

        it('should display a validation error message if the user does not enter the further information', async () => {
          postOptions.payload.furtherInformation = ''
          postOptions.payload.whatDoYouNeed = 'locateDocument'
          postOptions.payload.email = 'someone@somewhere.com'
          response = await TestHelper.submitPostRequest(server, postOptions, 400)
          await TestHelper.checkValidationError(
            response,
            'furtherInformation',
            'furtherInformation-error',
            VALIDATION_SUMMARY_HEADING,
            'Enter the further information'
          )
        })

        it('should display a validation error message if the further information is too long', async () => {
          postOptions.payload.whatDoYouNeed = 'documentQuestion'
          let furtherInformation = 'X'
          for (let i = 0; i < FURTHER_INFO_CHARACTER_LIMIT / 10; i++) {
            furtherInformation += '1234567890'
          }
          postOptions.payload.furtherInformation = furtherInformation
          postOptions.payload.email = 'someone@somewhere.com'
          response = await TestHelper.submitPostRequest(server, postOptions, 400)
          await TestHelper.checkValidationError(
            response,
            'furtherInformation',
            'furtherInformation-error',
            VALIDATION_SUMMARY_HEADING,
            `Enter shorter information with no more than ${FURTHER_INFO_CHARACTER_LIMIT} characters`
          )
        })
      })

      describe('Email address', () => {
        it('should display a validation error message if the user does not enter the email', async () => {
          postOptions.payload.whatDoYouNeed = 'permitEnquiry'
          postOptions.payload.furtherInformation = 'the request details'
          postOptions.payload.email = ''
          response = await TestHelper.submitPostRequest(server, postOptions, 400)
          await TestHelper.checkValidationError(
            response,
            'email',
            'email-error',
            VALIDATION_SUMMARY_HEADING,
            'Enter an email address'
          )
        })

        it('should display a validation error message if the email is not in the correct format', async () => {
          postOptions.payload.whatDoYouNeed = 'locateDocument'
          postOptions.payload.furtherInformation = 'the request details'
          postOptions.payload.email = 'invalid_email@somewhere'
          response = await TestHelper.submitPostRequest(server, postOptions, 400)
          await TestHelper.checkValidationError(
            response,
            'email',
            'email-error',
            VALIDATION_SUMMARY_HEADING,
            'Enter an email address in the correct format, like name@example.com'
          )
        })
      })
    })

    describe('Notify rate limiting', () => {
      beforeEach(() => {
        server.methods.registerNotifyMessages = jest.fn().mockReturnValue(false)
      })

      it('should redirect to the error page if the Notify rate limit has been reached', async () => {
        postOptions.payload.whatDoYouNeed = 'locateDocument'
        postOptions.payload.furtherInformation = 'the request details'
        postOptions.payload.email = 'someone@somewhere.com'

        const response = await TestHelper.getResponse(server, postOptions, 302)
        expect(response.headers.location).toEqual('/something-went-wrong')
      })
    })

    describe('App Insights', () => {
      it('should record an event when a user has requested further information about a permit (KPI 5)', async () => {
        postOptions.payload.whatDoYouNeed = 'locateDocument'
        postOptions.payload.furtherInformation = 'the request details'
        postOptions.payload.email = 'someone@somewhere.com'
        postOptions.payload.furtherInformation = 'Some additional information'

        expect(AppInsightsService.prototype.trackEvent).toBeCalledTimes(0)

        response = await TestHelper.submitPostRequest(server, postOptions)

        expect(AppInsightsService.prototype.trackEvent).toBeCalledTimes(1)
        expect(AppInsightsService.prototype.trackEvent).toBeCalledWith(
          expect.objectContaining({
            name: 'KPI 5 - User has requested further information about a permit',
            properties: {
              permitNumber: 'EAWML 65519',
              register: 'Installations',
              whatDoYouNeed: 'locateDocument',
              furtherInformation: 'Some additional information'
            }
          })
        )
      })
    })
  })
})
