'use strict'

const Lab = require('@hapi/lab')
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script()
const { expect } = require('@hapi/code')
const MiddlewareService = require('../../src/services/middleware.service')

describe('Middleware service:', () => {
  let middlewareService

  beforeEach(async () => {
    middlewareService = new MiddlewareService()
  })

  afterEach(async () => {
  })

  it('middleware service works as expected', async () => {
    // TODO
    // const result = await middlewareService.getData()
    expect(true).to.equal(true)
    expect(true).to.be.true()
    // expect(result).to.be.null()
    // TODO fix this
    // expect(result).to.be.undefined()

    // TODO: stub the rest call
    // TOOD: check that result
  })
})
