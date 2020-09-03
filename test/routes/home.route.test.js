const server = require('../../src/server')
const TestHelper = require('../utilities/test-helper')

let appInsightsService

function createMocks () {
  jest.mock('../../src/services/app-insights.service')
  appInsightsService = require('../../src/services/app-insights.service')
  appInsightsService.trackEvent.mockImplementation()
  appInsightsService.trackMetric.mockImplementation()
}

describe('Home route', () => {
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

  it('should create server connection', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }
    const data = await server.inject(options)
    expect(data.statusCode).toBe(200)

    expect(appInsightsService.trackEvent).toHaveBeenCalledTimes(2)
  })

  it('should have correct DOM elements', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const document = await TestHelper.submitRequest(server, options)

    const elementIds = [
      'data-heading',
      'data-item-1',
      'data-item-2',
      'data-item-3',
      'data-item-4'
    ]
    TestHelper.checkElementsExist(document, elementIds)

    const element = document.getElementById('data-heading')
    expect(element).toBeTruthy()
    expect(element.textContent).toEqual('Data Heading')
  })
})
