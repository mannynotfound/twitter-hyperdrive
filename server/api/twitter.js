import url from 'url'
import {OAuth} from 'oauth'
import querystring from 'querystring'
import Serializer from 'serializer'

const PORT = process.env.PORT || 3000
const PATH = process.env.CALLBACK_URL || 'http://localhost'
const callback_url = `${PATH}:${PORT}/api/login-twitter`
const consumer_key = process.env.CONSUMER_KEY
const consumer_secret = process.env.CONSUMER_SECRET
const serializer = Serializer.createSecureSerializer(consumer_key, consumer_secret)
const baseURI = "https://api.twitter.com/1.1"
const cookieName = process.env.COOKIE_NAME

export function parseSess(req) {
  let sess = {}

  try {
    sess = serializer.parse(req.cookies[cookieName])
  } catch(e) {
    console.error(e)
  } finally {
    return sess
  }
}

export function login() {
  let client = {
    version: '0.3.1'
  }

  const headers = {
    Accept: '*/*',
    Connection: 'close',
    'User-Agent': `${cookieName} ${client.version}`
  }

  const oAuth = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    consumer_key, consumer_secret, '1.0', callback_url,
    'HMAC-SHA1', null, headers
  )

  function requestCallback(cb) {
    return (err, data, response) => {
      if (err) return cb(err, data)
      let exception = null
      try {
        data = JSON.parse(data)
      } catch (e) {
        exception = e
      }
      cb(exception, response, data)
    }
  }

  function get(path, params, token, cb) {
    oAuth.get(
      baseURI + path + '?' + querystring.stringify(params),
      token.oauth_token,
      token.oauth_token_secret,
      requestCallback(cb)
    )
  }

  function post(path, params, token, cb) {
    oAuth.post(
      baseURI + path,
      token.oauth_token,
      token.oauth_token_secret,
      params,
      null,
      requestCallback(cb)
    )
  }

  function oAuthDelete(path, params, token, cb){
    oAuth.delete(
      baseURI + path,
      token.oauth_token,
      token.oauth_token_secret,
      requestCallback(cb)
    )
  }

  client.getLastTweets = (req, limit, cb) => {
    let tweets = []
    const token = parseSess(req)

    if (!token.oauth_token_secret) {
      return cb(new Error('no token'))
    }

    function filterTweets(tweets) {
      return tweets.map((t) => ({
        'id_str': t.id_str,
        'created_at': t.created_at
      }))
    }

    function getTweets(max_id) {
      const params = {
        'count': 200,
        'include_rts': true
      }

      if (max_id) params.max_id = max_id

      get('/statuses/user_timeline.json', params, token, (err, resp, json) => {
        if (err) return cb(err)

        tweets = tweets.concat(json)

        if (tweets.length >= limit || json.length === 1) {
          cb(null, filterTweets(tweets.splice(0, limit)))
        } else {
          getTweets(json[json.length - 1].id_str)
        }
      })
    }

    getTweets()
  }

  client.apiCall = (req, method, path, params, cb) => {
    const token = parseSess(req)

    if (!token.oauth_token_secret) {
      return cb(new Error('no token'))
    }

    switch (method) {
      case 'GET':
        get(path, params, token, cb)
        break
      case 'POST':
        post(path, params, token, cb)
        break
      case 'DELETE':
        oAuthDelete(path, params, token, cb)
        break
    }
  }

  client.getAccessToken = (req, res, cb) => {
    const sess = parseSess(req)
    const qs = url.parse(req.url, true).query || {}
    const {oauth_token, oauth_verifier} = qs
    const {request_secret} = sess

    // check if we have session tokens (already went through log in flow once)
    if (sess.oauth_token && sess.oauth_token_secret) {
      return cb(null, {
        oauth_token: sess.oauth_token,
        oauth_token_secret: sess.oauth_token_secret
      })
    }

    // agreed to oauth but not saved to session
    else if (oauth_verifier && oauth_token && request_secret) {
      oAuth.getOAuthAccessToken(
        oauth_token,
        request_secret,
        oauth_verifier,
        (error, token, token_secret) => {
          if (error) return cb(error, null)
            res.cookie(cookieName,
              serializer.stringify({
                oauth_token: token,
                oauth_token_secret: token_secret
              }), {
                path: '/',
                httpOnly: false
              }
            )

          cb(null, {
            oauth_token: token,
            oauth_token_secret: token_secret
          })
        }
      )
    }

    // hasnt logged in at all
    else {
      oAuth.getOAuthRequestToken(
        { oauth_callback: callback_url },
        (error, token, token_secret) => {
          if (error) return cb(error, null)

          res.cookie(cookieName,
            serializer.stringify({
              request_secret: token_secret
            }), {
              path: '/',
              httpOnly: false
            }
          )

          res.redirect('https://api.twitter.com/oauth/authorize?oauth_token=' + token)
      })
    }
  }

  return client
}
