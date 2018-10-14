import Phaser from 'phaser'
import { VirtualMachine } from '@language/virtual_machine'
import Tank from '@game/GameObjects/Tank'

import MessageComponent from '@game/GameObjects/Tank/components/MessageComponent'
import MoveComponent from '@game/GameObjects/Tank/components/MoveComponent'
import TurnComponent from '@game/GameObjects/Tank/components/TurnComponent'
import CpuComponent from '@game/GameObjects/Tank/components/CpuComponent'
import WaitComponent from '@game/GameObjects/Tank/components/WaitComponent'
import CannonComponent from '@game/GameObjects/Tank/components/CannonComponent'
import FireComponent from '@game/GameObjects/Tank/components/FireComponent'
import DebugComponent from '@game/GameObjects/Tank/components/DebugComponent'
import HealthComponent from '@game/GameObjects/Tank/components/HealthComponent'
import FollowCameraComponent from '@game/GameObjects/Tank/components/FollowCameraComponent'

const CLOCK_SPEED = 1.0 / 125.0

export default class RobotControllerSystem extends Phaser.GameObjects.Group {
  constructor(scene) {
    super(scene)
    this.scene = scene
    this.sys = this.scene.sys
    this.events = this.sys.events
    this._elapsed = 0.0
    this.enabled = true

    this.sys.events.once('shutdown', ::this.shutdown)
  }

  enemy(bytecode, playerId) {
    let tank = new Tank(this.scene, playerId)

    tank.components.push(new MoveComponent(tank))
    tank.components.push(new TurnComponent(tank))
    tank.components.push(new CpuComponent(tank, bytecode))
    tank.components.push(new WaitComponent(tank))
    tank.components.push(new CannonComponent(tank))
    tank.components.push(new FireComponent(tank))
    tank.components.push(new HealthComponent(tank))

    this.add(tank, true)
    return tank
  }

  player(bytecode, playerId) {
    let tank = this.enemy(bytecode, playerId)

    tank.components.push(new MessageComponent(tank))
    tank.components.push(new DebugComponent(tank))
    tank.components.push(new FollowCameraComponent(tank, this.scene.cameras.main))

    return tank
  }

  step(fixedDelta) {
    if (!this.enabled) {
      return
    }

    this._elapsed += fixedDelta
    let i = 0
    let entries = this.children.entries

    while(this._elapsed >= CLOCK_SPEED) {
      this._elapsed -= CLOCK_SPEED

      for (i = 0; i < entries.length; i++) {
        let tank = entries[i]
        tank.step(CLOCK_SPEED)
      }
    }

    if (entries.length <= 1) {
      let tank = entries[0]
      this.scene.events.emit('match:end', tank)
      this.enabled = false
    }
  }

  shutdown() {
    this.enabled = false
    this.events.off('shutdown', ::this.shutdown)

    this.scene = null
    this.sys = null
    this.events = null
    this.objects = []
    this._elapsed = 0.0
  }
}
