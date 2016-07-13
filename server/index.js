// create environment vars from config while developing
if (process.env.NODE_ENV !== 'production') {
  try {
    var env = require('../env')
    Object.keys(env).map(function (e) {
      process.env[e] = env[e]
    })
    console.log('Set environment variables successfully')
  } catch(error) {
    console.error('Missing environment file!')
    throw error
  }
}

require('babel-register')
require('./server')
