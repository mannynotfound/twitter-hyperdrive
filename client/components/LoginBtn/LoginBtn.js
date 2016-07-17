import React, {PropTypes} from 'react'
import {Link} from 'react-router'

class LoginBtn extends React.Component {
  static displayName = 'LoginBtn'

  static propTypes = {
    'app': PropTypes.object,
  }

  render() {
    const {app} = this.props

    return (
      <div id="LoginBtn" key="login">
        <div className="divider" />
        <div className="box">
          <div className="icon" />
          {app && app.user ?
            <Link to="/setup">
              {'Get Started! ->'}
            </Link>
            :
            <a href="/api/login-twitter">
              {"Sign in with Twitter"}
            </a>}
        </div>
      </div>
    )
  }
}

export default LoginBtn
