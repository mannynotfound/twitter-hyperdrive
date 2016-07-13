import * as AppActions from '../../actions/AppActions'
import React, {Component, PropTypes, cloneElement} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import cn from 'classnames'
import {isEqual, omit, cloneDeep} from 'lodash'

export class App extends Component {
  static propTypes = {
    'params': PropTypes.object.isRequired,
    'actions': PropTypes.object.isRequired,
    'layout': PropTypes.object.isRequired,
    'app': PropTypes.object.isRequired,
    'client': PropTypes.object.isRequired,
    'children': PropTypes.object.isRequired,
  }

  static childContextTypes = {
    'client': PropTypes.object,
  }

  getChildContext() {
    return {
      'client': this.props.client,
    }
  }

  componentDidMount() {
    if (this.props.client.cookie) {
      this.props.actions.fetchTweets(this.props.client.cookie)
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.params, this.props.params)) window.scrollTo(0, 0)
  }

  render() {
    const {children, client} = this.props
    const childProps = omit(cloneDeep(this.props), ['children'])
    const appClasses = cn('App', `--${client.agent}`)

    return (
      <div className={appClasses}>
        <div className="App-content">
          {cloneElement(children, childProps)}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    'app': state.app,
    'client': state.client,
    'layout': state.layout,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    'actions': bindActionCreators(AppActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App)
