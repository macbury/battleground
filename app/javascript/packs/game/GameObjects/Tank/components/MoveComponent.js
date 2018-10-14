import { Math } from 'phaser'

const PIXELS_PER_METER = 24
const MAX_MOVE_SPEED = 150
const ARRIVAL_TOLERANCE = 0.1 * PIXELS_PER_METER

/**
* Move required number of meters, or stop on any collision with another Tank/Obstalce
* Do not stop on hit
* @url https://gamedev.stackexchange.com/a/44419
*/
import BaseComponent from './BaseComponent'

export default class MoveComponent extends BaseComponent {
  constructor(tank) {
    super(tank)
    this.enabled = false
    this.physics = tank.scene.physics
    this.currentVector = new Math.Vector2()
    this.targetOffset = new Math.Vector2()
    this.targetVector = new Math.Vector2()

    this.tank.body.maxVelocity.set(MAX_MOVE_SPEED)
    
    this.targetVelocity = new Math.Vector2()

    this.tank.on('move:start', ::this.startMoving)
    this.tank.on('move:collide', ::this.onCollide)
    this.tank.gameEvents.once('shutdown', ::this.stopMoving)
  }

  startMoving(meters) {
    let { body, rotation } = this.tank

    if (meters < 0) {
      rotation = Math.Angle.Reverse(rotation)
      meters *= -1
    }

    this.enabled = true
    this.targetVelocity.reset()
    this.targetVector.reset()
                     .setToPolar(rotation, meters * PIXELS_PER_METER)
                     .add(this.tank)
  }

  onCollide() {
    this.stopMoving(false)
  }

  stopMoving(success = true) {
    if (this.enabled == true && this.tank.body != null) {
      this.enabled = false
      this.targetVelocity.reset()
      this.tank.body.velocity.copy(this.targetVelocity)
      this.tank.emit('move:end', success)
    }
  }

  arrive() {
    let { body } = this.tank
    this.currentVector.copy(this.tank)
    this.targetOffset.copy(this.targetVector)
                     .subtract(this.currentVector)

    let distance = this.targetOffset.length()
    // Check if we are there, return no steering
    if (distance <= ARRIVAL_TOLERANCE) {
      this.targetVelocity.reset()
      return true
    }

    this.targetVelocity.copy(this.targetOffset)
                       .scale(MAX_MOVE_SPEED / distance)

    if (this.targetVelocity.x > MAX_MOVE_SPEED) {
      this.targetVelocity.x = MAX_MOVE_SPEED
    }

    if (this.targetVelocity.y > MAX_MOVE_SPEED) {
      this.targetVelocity.y = MAX_MOVE_SPEED
    }

    return false
  }

  step() {
    if (!this.enabled || this.tank.body == null) {
      return
    }

    if (!this.tank.body.blocked.none) {
      this.stopMoving(false)
    } else if (this.arrive()) {
      this.stopMoving()
    }

    this.tank.body.velocity.copy(this.targetVelocity)
  }
}
