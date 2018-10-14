import React from 'react'
import ReactDOM from 'react-dom'
import Dropdown from '@components/Dropdown'
import LogView from '@components/LogView'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { STATE_PENDING, STATE_RUNNING, STATE_PAUSED } from '@reducers/consts'
import { runCode, haltProgram, pauseProgram, resumeProgram } from '@actions/testing'

class Toolbar extends React.Component {

  get powerLeft() {
    return Math.ceil(this.props.power.left / 100)
  }

  render() {
    let { loading, logs } = this.props
    return (
      <div className="preview-toolbar">
        <div className="btn-group mr-2">
          <button type="button" className={this.runPauseButtonClass} onClick={::this.runPauseCode} disabled={loading}>
            {this.runPauseButtonIcon}
          </button>
          <button type="button" className="btn btn-lg btn-secondary" onClick={::this.stopCode} disabled={loading || !this.canStop()}>
            <FontAwesomeIcon icon="stop" />
          </button>
        </div>

        <div style={{ marginLeft: 'auto' }}></div>

        <div>
          <FontAwesomeIcon icon="car-battery" />
          <br/>
          {this.powerLeft + "mAh"}
        </div>
      </div>
    )
  }

  isPending() {
    return this.props.state == STATE_PENDING
  }

  isRunning() {
    return this.props.state == STATE_RUNNING
  }

  isPaused() {
    return this.props.state == STATE_PAUSED
  }

  canRun() {
    return this.isPending() || this.isPaused()
  }

  canStop() {
    return this.isRunning() || this.isPaused()
  }

  stopCode(e) {
    e.preventDefault()
    this.props.haltProgram()
  }

  runPauseCode(e) {
    e.preventDefault()
     if (this.isRunning()) {
      this.props.pauseProgram()
    } else if (this.isPaused()) {
      this.props.resumeProgram()
    } else {
      this.props.runCode(this.props.content)
    }
  }

  get runPauseButtonClass() {
    if (this.isPaused() || this.isPending()) {
      return "btn btn-lg btn-primary"
    } else {
      return "btn btn-lg btn-danger"
    }
  }

  get runPauseButtonIcon() {
    if (this.isPaused() || this.isPending()) {
      return <FontAwesomeIcon icon="play" />
    } else {
      return <FontAwesomeIcon icon="pause" />
    }
  }
}

function mapStateToProps({ testing, editor }) {
  let { state, power, loading, logs } = testing
  let { content  } = editor
  return { state, content, power, loading, logs }
}

function mapActions(dispatch) {
  return bindActionCreators({ runCode, haltProgram, pauseProgram, resumeProgram }, dispatch)
}

export default connect(mapStateToProps, mapActions)(Toolbar)
