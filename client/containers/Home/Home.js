import React, {PropTypes} from 'react'
import LoginBtn from '../../components/LoginBtn/LoginBtn'

class Home extends React.Component {
  static displayName = "Home"

  static propTypes = {
    'app': PropTypes.object
  }

  render() {
    return (
      <div id="Home">
        <div className="container">
          <div className="full-width center">
            <LoginBtn {...this.props}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
