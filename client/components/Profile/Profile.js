import React, {PropTypes} from 'react'
import cn from 'classnames'
import Stats from './Stats'

class Profile extends React.Component {
  static displayName = 'Profile'

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

    const nameClass = cn('Profile-profile-name-link', {
      '--badge': user.verified,
    })

    return (
      <div className="Profile">
        <div className="Profile-inner">
        <div className="Profile-banner"
          style={{backgroundImage: `url(${user.profile_banner_url})`}} />
          <div className="Profile-content">
            <span className="Profile-profile-link">
              <img className="Profile-profile-img" src={user.profile_image_url} />
            </span>
            <Stats {... this.props} />
            <div className="Profile-user-fields">
              <div className="Profile-profile-name">
                <div className="Profile-profile-name-inner">
                  <a
                    className={nameClass}
                    href={profileUrl}>
                    {user.name}
                    {user.verified ?
                      <div className="Profile-profile-badge">
                        <div className="Profile-profile-badge-icn" />
                      </div> : null}
                  </a>
                </div>
              </div>
              <div className="Profile-profile-screenname">
                <a className="Profile-profile-screenname-link" href={profileUrl}>
                  {`@${user.screen_name}`}
                </a>
              </div>
              <div className="Profile-profile-bio">
                {user.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Profile
