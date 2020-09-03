'use strict'

jest.mock('../src/services/app-insights.service')

const server = require('../src/server')
const TestHelper = require('../test/utilities/test-helper')
const AppInsightsService = require('../src/services/app-insights.service')
const mockAppInsightsService = require('./mocks/app-insights.mock')

function createMocks () {
  AppInsightsService.mockImplementation(() => mockAppInsightsService)
}

describe('Server', () => {
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

  it('should successfully connect to the server', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }
    const document = await TestHelper.submitRequest(server, options)
    expect(document).toBeTruthy()
  })
})
