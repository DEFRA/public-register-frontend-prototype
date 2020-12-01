'use strict'

const server = require('../../src/server')
const TestHelper = require('../utilities/test-helper')

describe('ePR Redirect route', () => {
  const url = '/epr-redirect'

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

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET:', () => {
    const getOptions = {
      method: 'GET',
      url
    }

    it('should redirect to ePR', async () => {
      await TestHelper.submitGetRequest(server, getOptions, 302)
    })
  })
})
