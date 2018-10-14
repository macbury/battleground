import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <div className="sidebar">
      <a href="#">
        <img src="https://avatars1.githubusercontent.com/u/110908?s=460&v=4" />
      </a>

      <Link to="/">
        <FontAwesomeIcon icon="robot" />
        My robots
      </Link>

      <Link to="/documentation">
        <FontAwesomeIcon icon="book" />
        Documentation
      </Link>

      <Link to="/league">
        <FontAwesomeIcon icon="trophy" />
        League
      </Link>

      <a href="spotify:user:macbury:playlist:7jd76MUG1CN8ITCR6at4CZ" className="alternative">
        <FontAwesomeIcon icon="headphones" />
        Music
      </a>
    </div>
  )
}
