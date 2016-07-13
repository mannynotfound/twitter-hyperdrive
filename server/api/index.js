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

router.get('/getUser/:cookie', (req, res) => {
  // isomorphic fetch doesnt handle cookies well
  const {cookie} = req.params
  if (cookie) req.cookies[process.env.COOKIE_NAME] = cookie

  oAuth.apiCall(req, 'GET', '/account/verify_credentials.json', {}, (err, resp, json) => {
    if (err) handleError(err, res)
    else res.json(json).end()
  })
})

router.get('/fetchTweets/:cookie', (req, res) => {
  // isomorphic fetch doesnt handle cookies well
  const {cookie} = req.params
  if (cookie) req.cookies[process.env.COOKIE_NAME] = cookie

  oAuth.apiCall(req, 'GET', '/statuses/user_timeline.json', {}, (err, resp, json) => {
    if (err) handleError(err, res)
    else res.json(json).end()
  })
})

export default router
