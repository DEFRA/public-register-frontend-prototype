'use strict'

const server = require('../../src/server')
const TestHelper = require('../utilities/test-helper')

describe('Home route', () => {
  const url = '/'
  const nextUrl = '/select-register'

  const elementIDs = {
    homePageHeading: 'home-page-heading',
    homePageBody: 'home-page-body'
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
      TestHelper.checkBackLink(document, false)
    })

    it('should have the correct page heading', async () => {
      const element = document.querySelector(`#${elementIDs.homePageHeading}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual('Search for documents on the public register')
    })

    it('should have the correct body text', async () => {
      const element = document.querySelector(`#${elementIDs.homePageBody}`)
      expect(element).toBeTruthy()
      expect(TestHelper.getTextContent(element)).toEqual(
        'Use this service to obtain documents that are available on the public register'
      )
    })
  })

  describe('POST:', () => {
    let response
    let postOptions

    beforeEach(() => {
      postOptions = {
        method: 'POST',
        url,
        payload: {}
      }
    })

    describe('Success:', () => {
      it('should progress to the next route', async () => {
        response = await TestHelper.submitPostRequest(server, postOptions)
        expect(response.headers.location).toEqual(nextUrl)
      })
    })
  })
})
