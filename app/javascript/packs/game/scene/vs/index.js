import Scene from '../index'
import Compiler from '@language/compiler'
import Bullet from '@game/GameObjects/Bullet'
import RobotControllerSystem from './RobotControllerSystem'
import FixedLogicUpdateSystem from './FixedLogicUpdateSystem'
import enemyAi from './playground/enemy.tank'
import { STATE_RUNNING, STATE_PAUSED, STATE_PENDING } from '@reducers/consts'
import { previewReady, haltProgram } from '@actions/testing'
import { matchEnd } from '@actions/match'

const PLAYGROUND_SEED = 123

class BaseScene extends Scene {
  init({ seed }) {
    this.seed = seed
    this.random = new Phaser.Math.RandomDataGenerator([seed])
  }

  create() {
    super.create()
    this.cameras.main.zoom = 0.5
    this.map              = this.make.tilemap({ key: 'vs' })
    const tileset         = this.map.addTilesetImage('terrainTiles', 'tileset')
    const backgroundLayer = this.map.createStaticLayer('Background', tileset, 0, 0)

    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true
    })

    this.robots  = new RobotControllerSystem(this)
    this.logic   = new FixedLogicUpdateSystem(this)
    this.exiting = false

    this.physics.world.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels)
    this.cameras.main.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels)
    this.cameras.main.useBounds = true

    this.events.once('shutdown', () => { this.exiting = true })
  }

  randomPosition(tank) {
    tank.x = this.random.between(0, this.map.widthInPixels)
    tank.y = this.random.between(0, this.map.heightInPixels)
    tank.angle = this.random.between(0, 4) * 90
  }
}

export class PendingVSScene extends BaseScene {
  init(options) {
    super.init({ seed: Math.random() * 999999 })
  }

  create() {
    super.create()
    this.dispatch(previewReady())

    let player = this.robots.player([], "player")
    this.randomPosition(player)

    let enemy = this.robots.enemy([], "dummy")
    this.randomPosition(enemy)
  }

  update() {
    super.update()
    let { bytecode, state, speed } = this.props

    if (state == STATE_RUNNING) {
      this.scene.start('game:run', { bytecode, speed, seed: this.seed })
    }
  }
}

export class VSScene extends BaseScene {
  init({ bytecode, speed, seed }) {
    super.init({ seed })
    this.bytecode = bytecode
    this.speed = speed
  }

  create() {
    super.create()
    this.events.once('match:end', ::this.onMatchEnd)
    
    let player = this.robots.player(this.bytecode, "player")
    this.randomPosition(player)

    let enemy = this.robots.enemy(Compiler.compile(enemyAi), "dummy")
    this.randomPosition(enemy)
  }

  onPropsUpdate(props) {
    super.onPropsUpdate(props)
    let { state } = props
    if (state == STATE_PAUSED) {
      this.scene.pause()
    } else if (state == STATE_RUNNING || state == STATE_PENDING) {
      this.scene.resume()
    }
  }

  update() {
    super.update()
    if (this.exiting) {
      return
    }
    let { state } = this.props
    if (state == STATE_PENDING) {
      this.scene.start('game:pending')
    }
  }

  onMatchEnd(winner) {
    console.log('The winner is:', )
    this.dispatch(matchEnd(winner.playerId))
    // start pending,
    // set winner 
  }
}
