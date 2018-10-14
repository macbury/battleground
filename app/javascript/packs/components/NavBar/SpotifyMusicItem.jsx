import React from 'react'

export default class SpotifyMusicItem extends React.Component {

  constructor() {
    super()
    this.state = { opened: false }
  }

  toggle() {
    let { opened } = this.state
    opened = !opened
    this.setState({ opened })
  }

  get dropDownLiKlass() {
    if (this.state.opened) {
      return "nav-item dropdown show"
    } else {
      return "nav-item dropdown"
    }
  }

  get dropDownKlass() {
    if (this.state.opened) {
      return "dropdown-menu dropdown-menu-right show"
    } else {
      return "dropdown-menu"
    }
  }

  render() {
    return (
      <li className={this.dropDownLiKlass}>
        <a className="nav-link dropdown-toggle" href="#" onClick={::this.toggle}>
          Music
        </a>
        <div className={this.dropDownKlass}>
          <iframe src="https://open.spotify.com/embed/user/macbury/playlist/7jd76MUG1CN8ITCR6at4CZ" 
              width="300" 
              height="380" 
              frameBorder="0" 
              allow="encrypted-media">
          </iframe>
        </div>
      </li>
    )
  }
}