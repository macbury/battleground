import BaseComponent from './BaseComponent'

export default class HealthComponent extends BaseComponent {
  constructor(tank) {
    super(tank)

    this.events.once('tank:cpuHalt', ::this.kill)
    this.events.once('tank:exception', ::this.kill)
    this.events.on('tank:damage', ::this.receiveDamage)
  }

  receiveDamage(damage) {
    this.tank.health -= damage
    if (this.tank.health <= 0){
      this.tank.health = 0
      this.events.emit('update:stats')
      this.kill()
    } else {
      this.events.emit('update:stats')
    }
  }

  kill() {
    //TODO play explosion sound, animation and etc
    this.tank.kill()
  }
}
