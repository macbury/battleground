import Phaser from 'phaser'

export default class GameEngine extends Phaser.Game {
  constructor(container, afterCreateCallback, dispatch) {
    super({
      type: Phaser.WEBGL,
      parent: container,
      width: 100,
      height: 100,
      physics: {
        default: "arcade",
        arcade: {
          gravity: {
            x: 0,
            y: 0
          },
          debug: false
        }
      },
      callbacks: {
        postBoot: () => this.create()
      }
    })
    this.container = container
    this.afterCreateCallback = afterCreateCallback
    this.dispatch = dispatch
  }

  create() {
    window.addEventListener('resize', this.handleWindowResize.bind(this))
    this.handleWindowResize()
    this.afterCreateCallback(this)
  }

  receiveProps(props) {
    this.events.emit('onPropsUpdate', props)
    this.props = props
  }

  handleWindowResize() {
    let viewportWidth = this.container.parentElement.clientWidth
    let viewportHeight = this.container.parentElement.clientHeight

    this.container.style.width = viewportWidth + 'px'
    this.container.style.height = viewportHeight + 'px'
    this.resize(viewportWidth, viewportHeight)
  }
}
