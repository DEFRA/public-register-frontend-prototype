'use strict'

const server = require('../../src/server')

// Will be needed for Stories 15383 and 15384
// jest.mock('../../src/services/middleware.service')
// const MiddlewareService = require('../../src/services/middleware.service')

// jest.mock('../../src/services/notification.service')
// const MiddlewareService = require('../../src/services/notification.service')

const TestHelper = require('../utilities/test-helper')

describe('Contact route', () => {
  const url = '/contact'
  const nextUrl = '/contact/complete'

  const elementIDs = {
    pageHeading: 'page-heading',
    infoParagraph: 'info-paragraph',
    documentRequestDetails: 'documentRequestDetails',
    documentRequestDetailsInfo: 'documentRequestDetails-info',
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

    it('should display the correct page elements', () => {
      let element = document.querySelector(`#${elementIDs.pageHeading}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Request documents from the public register')

      element = document.querySelector(`#${elementIDs.documentRequestDetailsInfo}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('You can enter up to 2000 characters')

      element = document.querySelector('[for="documentRequestDetails"]')
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('What documents do you require?')

      element = document.querySelector(`#${elementIDs.documentRequestDetails}`)
      expect(element).toBeTruthy()

      element = document.querySelector('[for="email"]')
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

    beforeEach(async () => {
      postOptions = {
        method: 'POST',
        url,
        payload: {}
      }
    })

    describe('Success', () => {
      // Will be needed for Stories 15383 and 15384
      // Notification service will need to be stubbed once those stories have been implemented
      //     beforeEach(() => {
      //       MiddlewareService.mockImplementation(() => {
      //         return {
      //           checkPermitExists: jest.fn().mockReturnValue(true),
      //           search: jest.fn().mockReturnValue(mockData)
      //         }
      //       })
      //
      //       NotificationService.mockImplementation(() => {
      //         return {
      //           sendMessage: jest.fn().mockReturnValue(true),
      //         }
      //       })
      //     })

      it('should progress to the next route when the document request and email have been entered correctly', async () => {
        postOptions.payload.documentRequestDetails = 'the request details'
        postOptions.payload.email = 'someone@somewhere.com'
        response = await TestHelper.submitPostRequest(server, postOptions)

        // TODO - Stories 15383 and 15384 - ensure that sendMessage was called when the message sending has been implemented

        expect(response.headers.location).toEqual(nextUrl)
      })
    })

    describe('Failure', () => {
      const VALIDATION_SUMMARY_HEADING = 'There is a problem'

      describe('Document request details', () => {
        it('should display a validation error message if the user does not enter the document request', async () => {
          postOptions.payload.email = 'someone@somewhere.com'
          response = await TestHelper.submitPostRequest(server, postOptions, 400)
          await TestHelper.checkValidationError(
            response,
            'documentRequestDetails',
            'documentRequestDetails-error',
            VALIDATION_SUMMARY_HEADING,
            'Enter the document request details'
          )
        })

        it('should display a validation error message if the document request details are too long', async () => {
          postOptions.payload.documentRequestDetails =
            '2001_chars_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
          postOptions.payload.email = 'someone@somewhere.com'
          response = await TestHelper.submitPostRequest(server, postOptions, 400)
          await TestHelper.checkValidationError(
            response,
            'documentRequestDetails',
            'documentRequestDetails-error',
            VALIDATION_SUMMARY_HEADING,
            'Enter a shorter document request with no more than 2000 characters'
          )
        })
      })

      describe('Email address', () => {
        it('should display a validation error message if the user does not enter the email', async () => {
          postOptions.payload.documentRequestDetails = 'the request details'
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
          postOptions.payload.documentRequestDetails = 'the request details'
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
  })
})
