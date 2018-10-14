import React from 'react'
import LogoPath from '@images/logo_small.png'
import { Link } from 'react-router-dom'
import SpotifyMusicItem from './SpotifyMusicItem'

export default function NavBar() {
  return (
    <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
      <a className="navbar-brand">
        <img src={LogoPath} className="d-inline-block align-top" width="28" height="28"/>
        battleground.sh
      </a>

      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>

        <li className="nav-item">
          <Link to="/documentation" className="nav-link">Documentation</Link>
        </li>
      </ul>

      <ul className="navbar-nav ml-auto">
        <SpotifyMusicItem />

        <li className="nav-item">
          <Link to="/documentation" className="nav-link">Profile</Link>
        </li>
      </ul>
    </nav>
  )
}
