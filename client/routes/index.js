import React from 'react'
import {Route, Router, browserHistory, IndexRoute} from 'react-router'
import App from '../containers/App/App'
import Home from '../containers/Home/Home'
import Setup from '../containers/Setup/Setup'

export default (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="setup" component={Setup}/>
    </Route>
  </Router>
)
