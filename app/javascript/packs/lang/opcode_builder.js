import { assert } from './errors'

class Opcode {
  constructor(code, name, expression) {
    this.code = code
    this.name = name
    this.expression = expression
    this.power = 3
  }

  setCharge(power) {
    this.power = power
    return this
  }
}

export default class OpcodesBuilder {
  opcodes = {}
  index = 0
  indexToName = {}

  register(name, expression) {
    this.opcodes[name] = new Opcode(this.index, name, expression)
    this[name] = this.index
    this.indexToName[this.index] = name
    this.index += 1
    return this.opcodes[name]
  }

  /**
  * Resolve instruction name
  * @param {Integer} opcode 
  * @return {String} instruction name
  */
  resolve(opcode) {
    let name = this.indexToName[opcode]
    assert(name != null, `Unknown opcode: ${opcode}`)
    return name
  }

  execute(opcode, vm) {
    let name = this.resolve(opcode)
    let instruction = this.opcodes[name]
    vm.charge(instruction.power)
    instruction.expression(vm)
  }

  copy() {
    let b = new OpcodesBuilder();
    b.opcodes = {...this.opcodes}
    b.index = this.index
    b.indexToName = {...this.indexToName}
    return b
  }
}
