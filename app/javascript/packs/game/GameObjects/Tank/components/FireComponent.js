import BaseComponent from './BaseComponent'

export default class FireComponent extends BaseComponent {
  constructor(tank) {
    super(tank)

    this.tank.on('fire:start', ::this.startFire)
    this.enabled = false
    this.timeLeft = 0
  }

  startFire() {
    this.timeLeft = 0.35
    this.enabled = true

    // get rotation of cannon
    // spawn projectile on that angle
    // show muzzle
    // play sound
    // wait 0.5 second and emit fire end
    let bullet = this.tank.scene.bullets.getFirstDead(true)
    bullet.reset(this.tank)
  }

  step(delta) {
    if (!this.enabled) {
      return
    }

    this.timeLeft -= delta
    let alpha = (this.time / this.totalTime)

    if (this.timeLeft <= 0) {
      this.tank.emit('fire:end')
      this.enable = false
    }
  }
}
