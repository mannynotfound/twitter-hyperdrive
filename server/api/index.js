import express from 'express'
import {login} from './twitter'

const router = new express.Router()
const oAuth = login()

function handleError(err, res) {
  if (JSON.stringify(err).indexOf('no token')) {
    res.redirect('/api/login-twitter')
  } else {
    res.send(err, 500)
  }
}

router.get('/login-twitter', (req, res) => {
  oAuth.getAccessToken(req, res, (error, newToken) => {
    if (newToken) {
      res.redirect('/setup')
    } else {
      res.send(JSON.stringify(error)).end()
    }
  })
})

router.get('/logout-twitter', (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME)
  res.redirect('/')
})

router.get('/fetchUser/:cookie', (req, res) => {
  const {cookie} = req.params
  if (cookie) req.cookies[process.env.COOKIE_NAME] = cookie

  oAuth.apiCall(req, 'GET', '/account/verify_credentials.json', {}, (err, resp, json) => {
    if (err) handleError(err, res)
    else res.json(json).end()
  })
})

router.get('/fetchTweets/:cookie', (req, res) => {
  const {cookie} = req.params
  if (cookie) req.cookies[process.env.COOKIE_NAME] = cookie

  oAuth.apiCall(req, 'GET', '/statuses/user_timeline.json', {count: 200}, (err, resp, json) => {
    if (err) handleError(err, res)
    else res.json(json).end()
  })
})

router.get('/searchTweets/:cookie/:term', (req, res) => {
  const {cookie, term} = req.params
  if (cookie) req.cookies[process.env.COOKIE_NAME] = cookie

  oAuth.apiCall(req, 'GET', '/search/tweets.json', {
    q: term,
    count: 100,
  }, (err, resp, json) => {
    if (err) handleError(err, res)
    else res.json(json).end()
  })
})

export default router
