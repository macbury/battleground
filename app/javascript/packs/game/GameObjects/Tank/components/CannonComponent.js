import Phaser from 'phaser'
import BaseComponent from './BaseComponent'

const TIME_PER_DEGREE = 0.004

export default class CannonComponent extends BaseComponent {
  constructor(tank) {
    super(tank)
    this.muzzlePos = new Phaser.Math.Vector2() 

    this.tank.on('fire:start', ::this.startFire)
    this.tank.on('rotateCannon:start', ::this.startRotate)
    this.enabled = false
    this.targetRotation = 0
    this.originRotation = 0
    this.totalTime = 0
    this.time = 0
    this.tank.muzzle.alpha = 0.0
  }

  startFire() {
    this.tank.muzzle.alpha = 1.0
  }

  startRotate(angle) {
    angle *= -1
    this.originRotation = this.tank.cannon.rotation
    this.targetRotation = this.originRotation + Phaser.Math.DegToRad(angle)

    this.time = 0
    this.totalTime = TIME_PER_DEGREE * Math.abs(angle)

    this.enabled = true
  }

  step(delta) {
    let { muzzle, cannon } = this.tank
    this.rotation = this.tank.rotation + cannon.rotation
    this.muzzlePos.setToPolar(cannon.rotation, cannon.width)
    muzzle.rotation = cannon.rotation
    muzzle.x = this.muzzlePos.x + 4
    muzzle.y = this.muzzlePos.y

    muzzle.alpha -= delta
    if (muzzle.alpha < 0.0) {
      muzzle.alpha = 0
    }

    if (!this.enabled) {
      return
    }

    this.time += delta
    let alpha = (this.time / this.totalTime)

    if (alpha >= 1.0) {
      alpha = 1
      this.tank.emit('rotateCannon:end')
      this.enable = false
    }

    this.tank.cannon.rotation = Phaser.Math.Angle.Normalize(
      Phaser.Math.Linear(
        this.originRotation, 
        this.targetRotation, 
        alpha
      )
    )
  }
}
