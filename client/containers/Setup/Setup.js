import React, {PropTypes} from 'react'
import Scene from '../Scene/Scene'
import Search from '../../components/Search/Search'

class Setup extends React.Component {
  static displayName = 'Setup'

  static propTypes = {
    app: PropTypes.object
  }

  render() {
    const {tweets} = this.props.app
    if (!tweets) return <a href="/">{'please login'}</a>

    return (
      <div id="Scene-wrap" className="full-width">
        <Search {...this.props} />
        <Scene tweets={tweets} />
      </div>
    )
  }
}

export default Setup

