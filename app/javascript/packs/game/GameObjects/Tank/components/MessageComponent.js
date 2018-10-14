import BaseComponent from './BaseComponent'
import { logMessage } from '@actions/testing'
/**
* Sends message to stdout
*/
export default class MessageComponent extends BaseComponent {
  constructor(tank) {
    super(tank)

    this.tank.on('message', ::this.dispatchMessage)
  }

  dispatchMessage(message) {
    this.dispatch(logMessage(message))// send message to reducer
  }
}
