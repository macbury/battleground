import BaseComponent from './BaseComponent'
import { VirtualMachine } from '@language/virtual_machine'
import { programError } from '@actions/testing'

export default class CpuComponent extends BaseComponent {
  constructor(tank, bytecode) {
    super(tank)
    this.vm = new VirtualMachine(bytecode, {
      events: tank
    })
    tank.vm = this.vm

    this.gameEvents = tank.gameEvents
  }

  step(delta) {
    let vm = this.vm

    if (!vm.canStep()) {
      return
    }
    
    try {
      vm.step()
    } catch (error) {
      console.error(error)
      vm.halted = true
      let { message } = error
      this.kill({ message, ip: vm.ip })
      return
    }

    if (!vm.canStep()) {
      this.kill()
    }
  }

  kill(error) {
    if (error) {
      this.dispatch(programError(error))
      this.events.emit('tank:exception', error)
    } else {
      this.events.emit('tank:cpuHalt')
    }
  }
}
