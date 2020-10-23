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

describe('Home route', () => {
  const options = {
    method: 'GET',
    url: '/'
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

  // it('should create server connection', async () => {
  //   const options = {
  //     method: 'GET',
  //     url: '/'
  //   }
  //   const data = await server.inject(options)
  //   expect(data.statusCode).toBe(200)
  //   // expect(mockAppInsightsService.trackEvent).toHaveBeenCalledTimes(2)
  // })

  it('should have the Beta banner', async () => {
    TestHelper.checkBetaBanner(document)
  })

  it('should have the Back link', async () => {
    TestHelper.checkBackLink(document, false)
  })

  it.skip('should have correct DOM elements', async () => {
    const elementIds = [
      'data-heading',
      'data-item-1',
      'data-item-2',
      'data-item-3',
      'data-item-4',
      'data-item-5',
      'data-item-6'
    ]
    TestHelper.checkElementsExist(document, elementIds)

    const element = document.querySelector('#data-heading')
    expect(element).toBeTruthy()
    expect(TestHelper.getTextContent(element)).toEqual('Search Result')

    const dataElement = document.querySelector('#data-item-1')
    expect(dataElement).toBeTruthy()
    expect(TestHelper.getTextContent(dataElement)).toEqual('Name: Test 4')
  })
})
