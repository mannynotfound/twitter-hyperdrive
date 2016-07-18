import React, {PropTypes} from 'react'
import Loading from 'react-loading'
import LoginBtn from '../../components/LoginBtn/LoginBtn'

class Home extends React.Component {
  static displayName = "Home"

  static propTypes = {
    'app': PropTypes.object
  }

  render() {
    const {app} = this.props
    const notRequested = app && app.user === undefined

    return (
      <div id="Home">
        <div className="container">
          <div className="full-width center">
          {!notRequested ?
            <LoginBtn {...this.props}/> :
            <div className="Loader">
              <Loading
                delay={-1}
                type="spinningBubbles"
                color="#0aaaf5" />
            </div>}
          </div>
        </div>
      </div>
    )
  }
}

export default Home
