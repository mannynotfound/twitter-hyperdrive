import api from './api'
import compression from 'compression'
import config from '../webpack.config.babel'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import reactMiddleware from './middleware/reactMiddleware'
import webpack from 'webpack'

const DEBUG = process.env.NODE_ENV !== 'production'
const DEFAULT_PORT = 3000
const server = express()

//server.use(cors())
server.use(cookieParser())
server.set('env', DEBUG ? 'development' : 'production')
server.set('port', process.env.PORT || DEFAULT_PORT)
server.set('views', path.resolve(__dirname, 'views'))
server.set('view engine', 'jade')

server.use(compression())

if (DEBUG) {
  const compiler = webpack(config)
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackMiddleware = require('webpack-dev-middleware')

  server.use(morgan('dev'))
  server.use(webpackMiddleware(compiler, {
    historyApiFallback: true,
    hot: true,
    stats: {
      chunks: false
    },
  }))
  server.use(webpackHotMiddleware(compiler))
} else {
  server.use(express.static(path.resolve(__dirname, '../build')))
  server.use(morgan('combined'))
}

server.use('/api', api)
server.use(reactMiddleware)

server.listen(server.get('port'), () => {
  console.info(`Server running in ${server.get('env')} on port ${server.get('port')}`)
})
