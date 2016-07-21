import React, {PropTypes} from 'react'
import {findDOMNode} from 'react-dom'

class Search extends React.Component {
  static displayName = 'Search'

  static propTypes = {
    'actions': PropTypes.object,
    'app': PropTypes.object,
    'client': PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      open: false,
      inputValue: '',
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKey.bind(this), false)
  }

  handleKey(e) {
    const {actions, client} = this.props
    const {inputValue} = this.state

    if (e.keyCode === 13 && inputValue) {
      actions.searchTweets(inputValue, client.cookie)
      this.setState({
        inputValue: '',
        open: false,
      })
    }
  }

  componentDidUpdate(props, state) {
    if (!state.open && this.state.open) {
      findDOMNode(this.refs.searchInput).focus()
    }
  }

  toggleOpen() {
    this.setState({
      open: !this.state.open,
    })
  }

  onInput(e) {
    this.setState({
      inputValue: e.target.value,
    })
  }

  render() {
    const {open, inputValue} = this.state

    return (
      <div id="Search">
        {open ?
          <input
            onChange={this.onInput.bind(this)}
            value={inputValue}
            className="Search-input"
            ref="searchInput"
            type="text" /> :
          <div
            className="Search-btn"
            onClick={this.toggleOpen.bind(this)}/>}
          {open ?
            <div
              className="Search-close"
              onClick={this.toggleOpen.bind(this)}/> : null}
      </div>
    )
  }
}

export default Search
