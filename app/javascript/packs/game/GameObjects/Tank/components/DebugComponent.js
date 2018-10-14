import Phaser from 'phaser'
import BaseComponent from './BaseComponent'
import { updateStats } from '@actions/testing'

export default class DebugComponent extends BaseComponent {
  constructor(tank) {
    super(tank)

    this.events.on('update:stats', ::this.sendStats)
    this.sendStats()
  }

  sendStats() {
    let { voltage, maxVoltage, ip } = this.tank.vm
    let { health } = this.tank
    this.dispatch(updateStats({ health, ip, power: voltage, max: maxVoltage }))
  }
}
