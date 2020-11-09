'use strict'

const mockData = require('../data/permit-data')

module.exports = {
  search: jest.fn().mockReturnValue(mockData)
}
