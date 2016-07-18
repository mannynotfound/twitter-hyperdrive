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
    /* eslint-disable no-param-reassign */
    const tweets = this.props.tweets.map((t, i) => {
      const newTweet = {...t}
      newTweet.index = i
      return newTweet
    })

    const limit = 50
    this.visibleTweets = tweets.slice(0, limit)

    const htmlElms = this.createHTML(this.visibleTweets)
    const cfg = {
      mountCb: this.mountObj.bind(this)
    }

    const HTMLHyperdrive = require('html-hyperdrive')
    this.scene = new HTMLHyperdrive(container, htmlElms, cfg)
    this.scene.startScene()

    if (tweets.length <= limit) {
      return
    }

    this.invisibleTweets = tweets.slice(limit)

    setInterval(() => {
      const next = this.invisibleTweets.shift()
      const remove = this.visibleTweets.shift()
      this.invisibleTweets.push(remove)
      this.visibleTweets.push(next)

      const opts = this.createHTML([next])[0]
      this.scene.removeObject(remove.index)
      this.scene.addObject(opts, next.index)
    }, 15000)
  }

  mountObj(obj) {
    const idx = parseInt(obj.name.replace('stream_element_', ''), 10)
    render(<Tweet data={this.props.tweets[idx]} />, obj.element)
  }

  createHTML(tweets) {
    return tweets.map(() => ({
      style: {
        width: '590px',
        height: 'auto',
      },
      html: '<div></div>'
    }))
  }

  render() {
    return (
      <div ref="scene" className="full-width" />
    )
  }
}

export default Scene

