const server = require('../../src/server')
const TestHelper = require('../test-helper')
// const sinon = require('sinon')
// const appInsightsService = require('../../src/services/app-insights.service')

describe('Home route', () => {
  // let sandbox

  // TODO mock AppInsights class
  beforeAll((done) => {
    server.events.on('start', () => {
      done()
    })
  })

  afterAll((done) => {
    server.events.on('stop', () => {
      done()
    })
    server.stop()
  })

  beforeEach(() => {
    // sandbox = sinon.createSandbox()

    // jest.mock('../../src/services/app-insights.service')
    // appInsightsService.mockImplementation(() => {
    //   return {
    //     trackEvent: () => {},
    //     trackMetric: () => {}
    //   }
    // })
    // jest.mock(appInsightsService, () => {
    //   return {
    //     trackEvent: () => {},
    //     trackMetric: () => {}
    //   }
    // })
  })

  // console.log('######IAS:', appInsightsService.trackEvent)

  // sandbox.stub(appInsightsService, 'trackEvent')
  // sandbox.stub(appInsightsService, 'trackMetric')

  afterEach(() => {
    // sandbox.restore()
  })

  test('should create server connection', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }
    const data = await server.inject(options)
    expect(data.statusCode).toBe(200)
  })

  test('should have correct DOM elements', async () => {
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
