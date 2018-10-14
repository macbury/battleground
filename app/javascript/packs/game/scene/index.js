import Phaser from 'phaser'

export default class Scene extends Phaser.Scene {
  props = {}

  create() {
    this.gameEvents.on('onPropsUpdate', this.onPropsUpdate, this)
    this.events.on('resize', this.onResize, this)
    this.events.on('shutdown', this.destroy, this)
    this.updateStatsAccumulator = 0
  }

  get gameEvents() {
    return this.sys.game.events
  }

  dispatch(action) {
    this.sys.game.dispatch(action)
  }

  onPropsUpdate(props) {
    this.props = props
  }

  onResize(width, height) {
    this.cameras.resize(width, height)
  }

  destroy() {
    this.events.off('resize', this.onResize, this)
    this.events.off('update', this.handleStatsUpdate, this)
    this.events.off('shutdown', this.destroy, this)
  }
}
