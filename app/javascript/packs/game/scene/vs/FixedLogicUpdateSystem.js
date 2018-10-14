const FIXED_DELTA = 1000.0 / 60.0

export default class FixedLogicUpdateSystem {
  constructor(scene) {
    this.scene = scene
    
    this.physics = scene.physics
    this.bullets = scene.bullets
    this.world = this.physics.world
    this.sys = this.scene.sys
    this.robots = scene.robots
    this.paused = false
    this.disablePhysics()

    this.sys.events.on('update', ::this.update)
    this.sys.events.once('shutdown', ::this.shutdown)
  }

  get timeScale() {
    return this.scene.speed || 1
  }

  disablePhysics() {
    this.sys.events.off('update', this.physics.world.update, this.physics.world)
  }

  update(time, delta) {
    if (this.paused) {
      return
    }

    let fixedDelta = this.world._frameTime
    let msPerFrame = this.world._frameTimeMS
    
    this.world._elapsed += delta * this.timeScale

    while (this.world._elapsed >= msPerFrame) {
      this.world._elapsed -= msPerFrame

      this.world.step(fixedDelta)
      this.robots.step(fixedDelta)

      this.world.collide(this.robots, this.robots, this.onTankCollison)
      this.world.overlap(this.robots, this.bullets, this.onBulletCollide, this.onBulletCollisionProcess)
    }
  }

  onTankCollison(tankA, tankB) {
    tankA.emit('move:collide', tankB)
    //tankB.emit('move:collide', tankA)
  }

  onBulletCollide(tank, bullet) {
    tank.emit('tank:damage', bullet)
    bullet.kill()
    return false
  }

  onBulletCollisionProcess(tank, bullet) {
    return (tank != bullet.owner)
  }

  shutdown() {
    this.sys.events.off('update', ::this.update)
    this.sys.events.off('shutdown', ::this.shutdown)

    this.scene   = null
    this.physics = null
    this.world   = null
    this.sys     = null
    this.robots  = null
    this.paused  = true
  }
}
