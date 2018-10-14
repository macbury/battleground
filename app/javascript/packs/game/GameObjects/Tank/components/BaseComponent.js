
export default class BaseComponent {
  constructor(tank) {
    this.tank = tank
    this.events = tank
  }

  step(delta) {
    
  }

  dispatch(action) {
    this.tank.scene.dispatch(action)
  }
}
