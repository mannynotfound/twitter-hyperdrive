import React, {PropTypes} from 'react'
import {findDOMNode, render} from 'react-dom'
import Tweet from 'react-tweet'

class Scene extends React.Component {
  static displayName = 'Scene'

  static propTypes = {
    tweets: PropTypes.array
  }

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    const container = findDOMNode(this.refs.scene)
    const {tweets} = this.props
    this.visibleTweets = tweets.slice(0, 50)
    const htmlElms = this.createHTML(this.visibleTweets)
    const cfg = {
      mountCb: (obj) => {
        const idx = parseInt(obj.name.replace('stream_element_', ''), 10)
        render(<Tweet data={tweets[idx]} />, obj.element, () => {
          console.log('REACT RENDERED!!!!')
        })
      }
    }

    const HTMLHyperdrive = require('html-hyperdrive')
    this.scene = new HTMLHyperdrive(container, htmlElms, cfg)
    this.scene.startScene()
  }

  createHTML(tweets) {
    return tweets.map(() => ({
      style: {
        width: '590px',
        height: 'auto',
      },
      html: '<div>LOL</div>'
    }))
  }

  render() {
    return (
      <div ref="scene" className="full-width" />
    )
  }
}

export default Scene

