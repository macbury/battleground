import React from 'react'
import Phaser from '@components/phaser'

import { connect } from 'react-redux'
import { haltProgram, programError } from '@actions/testing'
import { STATE_RUNNING, STATE_PENDING } from '@reducers/consts'

import { LoadingScene } from '@game/scene/loading'
import { PendingVSScene, VSScene } from '@game/scene/vs'

class Preview extends React.Component {
  render() {
    let { error } = this.props
    return (
      <div className="preview-view">
        <Phaser onPhaserDidCreate={::this.onPhaserDidCreate} {...this.props} />
      </div>
    )
  }

  onPhaserDidCreate(game) {
    game.scene.add('loading', LoadingScene, true)
    game.scene.add('game:pending', PendingVSScene)
    game.scene.add('game:run', VSScene)
  }
}

function mapStateToProps({ testing, editor, match }) {
  let { bytecode, state, speed } = testing
  let { error } = editor
  let { currentPlayer } = match
  return { bytecode, state, error, speed, currentPlayer }
}

export default connect(mapStateToProps)(Preview)
