import BaseComponent from './BaseComponent'

export default class FollowCameraComponent extends BaseComponent {
  constructor(tank, camera) {
    super(tank)
    this.camera = camera
    this.events.once('tank:die', ::this.stopFollowing)

    this.camera.startFollow(this.tank)
  }

  stopFollowing() {
    this.camera.stopFollow()
  }
}
