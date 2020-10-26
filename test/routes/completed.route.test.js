'use strict'

const server = require('../../src/server')
const TestHelper = require('../utilities/test-helper')

describe('Completed route', () => {
  const url = '/completed'

  let document

  beforeAll((done) => {
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

  describe('GET:', () => {
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
      TestHelper.checkBackLink(document)
    })

    it('should have the correct page heading', async () => {
      const element = document.querySelector('.govuk-panel__title')
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Search result')
    })

    it('should have the correct body text', async () => {
      const element = document.querySelector('.govuk-panel__body')
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toContain('You searched for')
    })
  })
})
