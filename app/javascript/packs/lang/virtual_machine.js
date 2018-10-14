import EventEmitter from 'eventemitter3'
import Opcodes from './opcodes'
import { ConsoleIO } from './io'
import { Frames } from './frame'
import Stack from './stack'
import { assert, OutOfPower } from './errors'
import Random from './random'

export class VirtualMachine {
  /**
  * Instruction pointer
  */
  _ip = 0
  stack = []
  program = []
  events = {}
  halted = false

  constructor(instructions, options) {
    let { voltage, opcodes, events } = options || {}

    this.program = instructions || []
    this.opcodes = opcodes || Opcodes
    this._ip = 0
    this.maxVoltage = this.voltage = voltage || 300000
    this.stack = new Stack()
    this.frames = new Frames()
    this.random = new Random()
    this.paused = false
    this.events = events || new EventEmitter()
  }

  set ip(newIp) {
    assert(typeof(newIp) == 'number', `Address ${newIp} is invalid`)
    assert(newIp < this.program.length, `Address ${newIp} is outside of program`)
    this._ip = newIp
  }

  get ip() {
    return this._ip
  }

  get frame() {
    return this.frames.current
  }

  wait(promise) {
    this.pause()
    return promise.then(::this.resume)
  }

  waitForEvent(eventName) {
    return this.wait(new Promise((resolve) => {
      this.events.once(eventName, resolve)
    }))
  }

  emit(eventName, options={}) {
    this.events.emit(eventName, options)
  }

  /**
  * Run program execution until its halted
  */
  run() {
    while(this.step()) {}
  }

  pause() {
    this.paused = true
  }

  resume() {
    this.paused = false
  }

  canStep() {
    return this.paused || !this.halted && this.ip < this.program.length
  }

  /**
  * Each instruction takes some amount of voltage
  */
  charge(voltage) {
    let nextVoltage = this.voltage - voltage
    if (nextVoltage > 0) {
      this.voltage -= voltage
      return
    }
    
    throw new OutOfPower()
  }

  /**
  * Step to next instruction
  */
  step() {
    if (this.paused) {
      return true
    }
    
    assert(!this.halted, "VM is halted!")

    let nextOpcode = this.next("End of program")
    this.opcodes.execute(nextOpcode, this)
    if (this.canStep()) {
      return true
    } else {
      this.halted = true
      return false
    }
  }

  next(message = "End of program") {
    assert(this.ip < this.program.length, message)
    let nextWord = this.program[this.ip]
    this._ip += 1
    return nextWord
  }
}
