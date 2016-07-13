import React, {PropTypes} from 'react'

/* abbreviate number adapted from
  http://stackoverflow.com/questions/2692323/code-golf-friendly-number-abbreviator */

export function abbrNum(number, decPlaces) {
  // 2 decimal places => 100, 3 => 1000, etc
  const _decPlaces = Math.pow(10, decPlaces)
  let newNum = number

  // Enumerate number abbreviations
  const abbrev = ["k", "m", "b", "t"]

  // Go through the array backwards, so we do the largest first
  for (let i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    const size = Math.pow(10, (i + 1) * 3)
    // If the number is bigger or equal do the abbreviation
    if (size <= number) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.

      newNum = Math.round(number * _decPlaces / size) / _decPlaces

      // Add the letter for the abbreviation
      newNum += abbrev[i]

      // We are done... stop
      break
    }
  }

  return newNum
}

class Stats extends React.Component {
  static displayName = 'Stats'

  static propTypes = {
    user: PropTypes.object,
  }

  static defaultProps = {
    user: null,
  }

  render() {
    const {user} = this.props
    if (!user) return null

    const baseUrl = 'https://twitter.com/'
    const profileUrl = baseUrl + user.screen_name

    const stats = [
      {
        'label': 'TWEETS',
        'prop': 'statuses_count',
        'url': '/',
      },
      {
        'label': 'FLLWNG',
        'prop': 'friends_count',
        'url': '/following',
      },
      {
        'label': 'FLLWRS',
        'prop': 'followers_count',
        'url': '/followers',
      },
      {
        'label': 'LIKES',
        'prop': 'favourites_count',
        'url': '/likes',
      },
    ]

    return (
      <div className="Stats">
        {stats.map((s, i) => (
           <a className="Stat" href={profileUrl + s.url} key={i}>
              <div className="Stat-label">{s.label}</div>
              <div className="Stat-value">{abbrNum(user[s.prop], 1)}</div>
           </a>
        ))}
      </div>
    )
  }
}

export default Stats
