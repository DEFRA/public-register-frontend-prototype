'use strict'

const { init } = require('../src/lib/server')

describe('GET /', () => {
  let server

  beforeEach(async () => {
    server = await init()
  })

  afterEach(async () => {
    await server.stop()
  })

  test.skip('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/'
    })
    expect(res.statusCode).toEqual(200)
  })
})
