'use strict'

const server = require('../../src/server')

const TestHelper = require('../utilities/test-helper')

describe('Contact complete route', () => {
  const url = '/contact/complete'

  const elementIDs = {
    requestSentPanel: 'request-sent-panel',
    whatHappensNext: 'what-happens-next',
    timescaleText: 'timescale-text',
    feedbackLink: 'feedback-link',
    feedbackLinkAdditionalInfo: 'feedback-link-additional-info'
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

    it('should have the "Request sent" panel', () => {
      const element = document.querySelector(`#${elementIDs.requestSentPanel} > h1`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Request sent')
    })

    it('should have the "What happens next" heading', () => {
      const element = document.querySelector(`#${elementIDs.whatHappensNext}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('What happens next')
    })

    it('should have the timescale text', () => {
      const element = document.querySelector(`#${elementIDs.timescaleText}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual(
        'You should receive a response to your request within the next 20 working days.'
      )
    })

    it('should have the feedback link', () => {
      const element = document.querySelector(`#${elementIDs.feedbackLink}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('What did you think of this service?')
    })

    it('should have the feedback link additional information', () => {
      const element = document.querySelector(`#${elementIDs.feedbackLinkAdditionalInfo}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('(takes 30 seconds)')
    })
  })
})
