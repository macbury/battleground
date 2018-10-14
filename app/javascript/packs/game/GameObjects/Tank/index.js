import Phaser from 'phaser'

export default class Tank extends Phaser.GameObjects.Container  {
  constructor(scene, playerId) {
    super(scene, 0, 0)

    this.playerId       = playerId
    this.active         = true
    this.visible        = true
    this.health         = 100
    this.components     = []
    this.scene          = scene

    this.tankBase       = this.scene.add.sprite(0, 0, 'sprites', 'tankBody_darkLarge_outline.png')
    this.cannon         = this.scene.add.sprite(4, 0, 'sprites', 'tankDark_barrel2_outline.png')
    this.muzzle         = this.scene.add.sprite(0, 0, 'sprites', 'shotLarge.png')

    this.add(this.tankBase)
    this.add(this.muzzle)
    this.add(this.cannon)
    this.setSize(this.tankBase.width, this.tankBase.height)

    this.muzzle.setOrigin(0.0, 0.5)
    this.cannon.setOrigin(0.0, 0.5)
    this.tankBase.setOrigin(0.5, 0.5)

    this.scene.physics.world.enable(this)

    this.body.bounce.set(0.1, 0.1)

    this.body.onCollide = true
    this.body.onWorldBounds = true
    this.body.collideWorldBounds = true

    this.body.allowDrag = true
    this.body.radius    = 20
    this.body.damping   = true
    this.body.drag.set(100)

    this.body.immovable = false
    this.body.isCircle  = true

    Phaser.GameObjects.BuildGameObject(scene, this, { add: false })
  }

  get gameEvents() {
    return this.scene.sys.events
  }

  step(delta) {
    for (var i = 0; i < this.components.length; i++) {
      this.components[i].step(delta)
    }
  }

  kill() {
    this.emit('tank:die', this)
    this.destroy(true)
  }
}
