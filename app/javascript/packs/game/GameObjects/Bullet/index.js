import Phaser from 'phaser'

const MAX_MOVE_SPEED = 300

export default class Bullet extends Phaser.GameObjects.Sprite  {
  constructor(scene) {
    super(scene, 0, 0, 'sprites', 'bulletDark2_outline.png')

    this.visible = false
    this.physics = scene.physics
    this.setOrigin(0, 0.5)
    scene.physics.world.enable(this)

    this.body.maxVelocity.set(MAX_MOVE_SPEED)

    this.body.setCircle(7)
    this.body.onCollide          = true
    this.body.onWorldBounds      = true
    this.body.collideWorldBounds = true
    this.body.immovable          = false
  }

  reset(tank) {
    let pos = new Phaser.Math.Vector2()
    this.owner = tank
    this.active = true
    this.visible = true
    this.rotation = tank.rotation + tank.cannon.rotation
    pos.setToPolar(this.rotation, tank.cannon.width + this.width)
    pos.add(tank)
    this.x = pos.x + 4
    this.y = pos.y
    
    this.physics.velocityFromAngle(this.angle, MAX_MOVE_SPEED, this.body.velocity)
  }

  update() {
    super.update()

    if (!Phaser.Geom.Rectangle.Contains(this.physics.world.bounds, this.x, this.y)) {
      this.kill()
    }
  }

  kill() {
    this.active = false
    this.visible = false
    this.x = -10
    this.y = -10
  }
}
