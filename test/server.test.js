'use strict'

const server = require('../src/server')
const TestHelper = require('./test-helper')

describe('Server', () => {
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

  test('should successfully connect to the server', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }
    const document = await TestHelper.submitRequest(server, options)
    expect(document).toBeTruthy()
  })
})
