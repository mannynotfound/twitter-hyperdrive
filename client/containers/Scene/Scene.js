import React, {PropTypes} from 'react'
import {findDOMNode, render} from 'react-dom'
import Tweet from 'react-tweet'
import {isEqual} from 'lodash'

class Scene extends React.Component {
  static displayName = 'Scene'

  static propTypes = {
    tweets: PropTypes.array
  }

  constructor(props) {
    super(props)
    this.cycle = true
  }

  shouldComponentUpdate() {
    return false
  }

  componentWillReceiveProps(props) {
    if (!isEqual(props.tweets, this.props.tweets)) {
      this.resetScene()
    }
  }

  componentDidMount() {
    this.createNewScene()
  }

  resetScene() {
    this.cycle = false
    this.scene.removeAll(() => {
      this.cycle = true
      this.createNewScene()
    })
  }

  createNewScene() {
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

    clearInterval(this.timer)
    this.timer = setInterval(() => {
      if (!this.cycle) return

      const next = this.invisibleTweets.shift()
      const remove = this.visibleTweets.shift()
      this.invisibleTweets.push(remove)
      this.visibleTweets.push(next)

      const opts = this.createHTML(next)
      this.scene.removeObject(remove.index)
      this.scene.addObject(opts, next.index)
    }, 15000)
  }

  mountObj(obj) {
    const idx = parseInt(obj.name.replace('stream_element_', ''), 10)
    render(<Tweet data={this.props.tweets[idx]} />, obj.element)
  }

  createHTML(tweets) {
    const tweetHTML = {
      style: {
        width: '590px',
        height: 'auto',
      },
      html: '<div></div>'
    }

    if (Array.isArray(tweets)) {
      return tweets.map(() => ({...tweetHTML}))
    }

    return {...tweetHTML}
  }

  render() {
    return (
      <div ref="scene" className="full-width" />
    )
  }
}

export default Scene
