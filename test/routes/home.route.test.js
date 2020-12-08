'use strict'

const server = require('../../src/server')
const TestHelper = require('../utilities/test-helper')

// These imports and functions will be needed when developing Feature 12215 (Monitor performance of service) and
// Story 7158 (View permit documents, view permit page)

// jest.mock('../../src/services/app-insights.service')
// jest.mock('../../src/services/middleware.service')

// const AppInsightsService = require('../../src/services/app-insights.service')
// const MiddlewareService = require('../../src/services/middleware.service')

// const mockAppInsightsService = require('../mocks/app-insights.service.mock')
// const mockMiddlewareService = require('../mocks/middleware.service.mock')

// This will be called in the beforeAll method
// const createMocks = () => {
//   AppInsightsService.mockImplementation(() => mockAppInsightsService)
//   MiddlewareService.mockImplementation(() => mockMiddlewareService)
// }

describe('Home route', () => {
  const url = '/'
  const nextUrl = '/enter-permit-number'

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
      expect(TestHelper.getTextContent(element)).toEqual(
        'Search for documents on the public register'
      )
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

    beforeEach(async () => {
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

  // This test will be needed when developing Feature 12215 (Monitor performance of service)
  // it('should create server connection', async () => {
  //   const options = {
  //     method: 'GET',
  //     url: '/'
  //   }
  //   const data = await server.inject(options)
  //   expect(data.statusCode).toBe(200)
  //   // expect(mockAppInsightsService.trackEvent).toHaveBeenCalledTimes(2)
  // })
})
