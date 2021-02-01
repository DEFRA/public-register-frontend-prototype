'use strict'

const server = require('../../src/server')
const TestHelper = require('../utilities/test-helper')

describe('Permit not found route', () => {
  const url = '/something-went-wrong'

  const elementIDs = {
    pageHeading: 'page-heading',
    paragraph1: 'paragraph-1',
    paragraph2: 'paragraph-2',
    paragraph3: 'paragraph-3',
    paragraph4: 'paragraph-4'
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

    it('should display the correct page heading', () => {
      const element = document.querySelector(`#${elementIDs.pageHeading}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Oops, something went wrong')
    })

    it('should display the correct paragraphs', () => {
      let element = document.querySelector(`#${elementIDs.paragraph1}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Sorry, there has been a technical problem.')

      element = document.querySelector(`#${elementIDs.paragraph2}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('You can try going back.')

      element = document.querySelector(`#${elementIDs.paragraph3}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual(
        'If the problem happens again, you could try waiting for 5 minutes and then go back and reload the page.'
      )

      element = document.querySelector(`#${elementIDs.paragraph4}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual(
        'You do not need to tell us about this problem because the system will send us a message.'
      )
    })
  })
})
