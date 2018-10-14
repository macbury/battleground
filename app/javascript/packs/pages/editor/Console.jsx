import React from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class Console extends React.Component {
  scrollToBottom = () => {
    this.scrollDiv.scrollIntoView({ behavior: "smooth" })
  }

  componentDidMount() {
    this.scrollToBottom()
  }

  componentDidUpdate() {
    if (this.props.logs.length > 0) {
      this.scrollToBottom()
    }
  }

  get lines() {
    let key = 0
    let lines = this.props.logs.map((message) => {
      key += 1
      return <code key={`message-${key}`}>{message}</code>
    })
    return lines
  }

  get error() {
    let { error } = this.props

    if (error) {
      return (
        <code className="error">
          <pre>{error.message}</pre>
        </code>
      )
    } else {
      return null
    }
  }

  get success() {
    let { winner } = this.props

    if (winner == null) {
      return null
    }

    if (winner == 'player') {
      return (
        <code className="success important">
          <pre>You won!</pre>
        </code>
      )
    } else {
      return (
        <code className="error important">
          <pre>Enemy tank won!</pre>
        </code>
      )
    }
    
  }

  render() {
    return (
      <div className="preview-console">
        <div className="preview-console-header">
          <FontAwesomeIcon icon="terminal" />
          <h4>Console</h4>
        </div>
        <div className="preview-console-content">
          <div className="preview-console-scroller">
            {this.lines}
            {this.error}
            {this.success}
            <div ref={(el) => { this.scrollDiv = el }}></div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ testing, editor, match }) {
  let { logs } = testing
  let { error } = editor
  let { winner } = match
  return { logs, error, winner }
}

export default connect(mapStateToProps)(Console)
