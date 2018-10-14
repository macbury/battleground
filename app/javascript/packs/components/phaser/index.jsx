import PropTypes from 'prop-types'
import React from 'react'
import GameEngine from './engine'

export default class Phaser extends React.Component {
  componentDidMount() {
    this.game = new GameEngine(this.el, ::this.onPhaserBootComplete, this.props.dispatch)
    window.addEventListener('ui:resize', ::this.updateSize)
  }

  onPhaserBootComplete(game) {
    if (this.game != null) {
      this.props.onPhaserDidCreate(game)
      this.game.receiveProps(this.props)
      this.game.resize(10, 10)
      this.updateSize()
    }
  }

  updateSize() {
    if (this.game != null) {
      this.game.handleWindowResize()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('ui:resize', ::this.updateSize)
    this.game.destroy()
    this.game = null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.game.receiveProps(this.props)
    this.updateSize()
  }

  render() {
    this.updateSize()
    return <div className="gameplay" ref={el => this.el = el} />
  }
}

Phaser.propTypes = {
  onPhaserDidCreate: PropTypes.func.isRequired
};
