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
    /* eslint-disable no-param-reassign */
    this.visibleTweets = tweets.slice(0, 50).map((t, i) => {
      t.index = i
      return t
    })

    this.usedTweets = []
    const htmlElms = this.createHTML(this.visibleTweets)
    const cfg = {
      mountCb: this.mountObj.bind(this)
    }

    const HTMLHyperdrive = require('html-hyperdrive')
    this.scene = new HTMLHyperdrive(container, htmlElms, cfg)
    this.scene.startScene()

    setInterval(() => {
      let next = null

      tweets.forEach((t) => {
        if (next) return

        const id = t.id
        let used = false
        this.visibleTweets.forEach((v) => {
          if (used) return
          if (v.id === id || this.usedTweets.indexOf(id) > -1) {
            used = true
          }
        })

        if (!used) {
          next = t
        }
      })

      if (!next) {
        return console.log('NO NEW TWEETS TO USE')
      }

      const first = this.visibleTweets.shift()
      this.usedTweets.push(first.index)
      const last = this.visibleTweets[this.visibleTweets.length - 1]
      next.index = last.index + 1
      this.visibleTweets.push(next)
      const opts = this.createHTML([next])[0]
      this.scene.addObject(opts, this.visibleTweets.length)

      return this.scene.removeObject(first.index)
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

