import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class LogView extends React.Component {

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

  get lines() {
    let key = 0
    return this.props.logs.map((message) => {
      key += 1
      return <code key={`message-${key}`}>{message}</code>
    })
  }

  render() {
    let { logs } = this.props

    return (
      <div className="btn-group mr-2 dropup" onClick={::this.toggleVisibility}>
        <button type="button" className="btn btn-secondary dropdown-toggle">
          <FontAwesomeIcon icon="terminal" />
          <span className="ml-2 badge badge-light">{logs.length}</span>
        </button>
        <div className="dropdown-menu dropdown-menu-left log-view" style={this.dropdownStyle}>
          {this.lines}
        </div>
      </div>
    )
  }
}

LogView.propTypes = {
  badge: PropTypes.array
}
