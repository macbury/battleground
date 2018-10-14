import React from 'react'
import PropTypes from 'prop-types'

export default class Dropdown extends React.Component {

  constructor(props) {
    super(props)
    this.state = { opened: false }
  }

  get dropdownStyle() {
    if (this.state.opened) {
      return { display: 'block' }
    } else {
      return { display: 'none' }
    }
  }

  toggleVisibility() {
    let { opened } = this.state
    this.setState({
      opened: !opened
    })
  }

  render() {
    let { label, badge, children } = this.props

    return (
      <div className="btn-group dropup" onClick={::this.toggleVisibility}>
        <button type="button" className="btn btn-secondary dropdown-toggle">
          {label}
          <span className="ml-2 badge badge-light">{badge}</span>
        </button>
        <div className="dropdown-menu dropdown-menu-right" style={this.dropdownStyle}>
          {children}
        </div>
      </div>
    )
  }
}

Dropdown.propTypes = {
  label: PropTypes.string.isRequired,
  badge: PropTypes.string
}
