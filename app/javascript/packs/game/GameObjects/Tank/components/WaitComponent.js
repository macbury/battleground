import BaseComponent from './BaseComponent'

export default class WaitComponent extends BaseComponent {
  constructor(tank) {
    super(tank)

    this.tank.on('sleep:start', ::this.startSleep)
    this.enabled = false
    this.timeLeft = 0
  }

  startSleep(miliseconds) {
    this.timeLeft = miliseconds / 1000.0
    this.enabled = true
  }

  step(delta) {
    if (!this.enabled) {
      return
    }

    this.timeLeft -= delta
    let alpha = (this.time / this.totalTime)

    if (this.timeLeft <= 0) {
      this.tank.emit('sleep:end')
      this.enable = false
    }
  }
}
