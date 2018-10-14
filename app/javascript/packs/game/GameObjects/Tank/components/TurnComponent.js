import Phaser from 'phaser'
import BaseComponent from './BaseComponent'

const TIME_PER_DEGREE = 0.005

export default class TurnComponent extends BaseComponent {
  constructor(tank) {
    super(tank)

    this.tank.on('turn:start', ::this.startTurn)
    this.enabled = false
    this.targetRotation = 0
    this.originRotation = 0
    this.totalTime = 0
    this.time = 0
  }

  startTurn(angle) {
    angle *= -1
    this.originRotation = this.tank.rotation
    this.targetRotation = this.originRotation + Phaser.Math.DegToRad(angle)

    this.time = 0
    this.totalTime = TIME_PER_DEGREE * Math.abs(angle)

    this.enabled = true
  }

  step(delta) {
    if (!this.enabled) {
      return
    }

    this.time += delta
    let alpha = (this.time / this.totalTime)

    if (alpha >= 1.0) {
      alpha = 1
      this.tank.emit('turn:end')
      this.enable = false
    }

    this.tank.rotation = Phaser.Math.Angle.Normalize(
      Phaser.Math.Linear(
        this.originRotation, 
        this.targetRotation, 
        alpha
      )
    )
  }
}
