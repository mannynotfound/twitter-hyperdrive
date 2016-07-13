import {RouterContext, match} from 'react-router'
import {Provider} from 'react-redux'
import React from 'react'
import configureStore from '../../client/store/configureStore'
import createLocation from 'history/lib/createLocation'
import {setClient} from '../../client/actions/AppActions'
import {renderToString} from 'react-dom/server'
import routes from '../../client/routes'
import MobileDetect from 'mobile-detect'

function hydrateInitialStore (req) {
  const md = new MobileDetect(req.headers['user-agent'])
  const agent = md.mobile() ? 'mobile' : 'desktop'
  req.cookies = req.cookies || {}
  const cookie = req.cookies[process.env.COOKIE_NAME]

  return (dispatch) => Promise.all([dispatch(setClient({cookie, agent}))])
}

export default function reactMiddleware (req, res) {
  const location = createLocation(req.url)

  match({routes, location}, (error, redirectLocation, renderProps) => {
    if (error) return res.status(500).send(error.message)
    if (redirectLocation) return res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    if (!renderProps) return res.redirect(302, '/')

    const assets = require('../../build/assets.json')
    const store = configureStore()

    return store.dispatch(hydrateInitialStore(req)).then(() => {
      const initialState = JSON.stringify(store.getState())
      let content

      try {
        content = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        )
      } catch(e) {
        console.log('ERROR RENDERING APP', e)
        process.exit()
      }

      return res.render('index', {content, assets, initialState})
    })
  })
}
