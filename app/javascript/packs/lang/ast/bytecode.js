import Opcodes from '../opcodes'

class Instruction {
  constructor(opcodeName, operands) {
    this.opcodeName = opcodeName
    this._operands = operands
  }

  resolve(context) {
    this._operands = this._operands.map((operand) => {
      if (context.isLabel(operand)) {
        let labelSymbol = context.lookupSymbol(operand)
        return labelSymbol.address
      } else {
        return operand
      }
    })
  }

  get operands() {
    return this._operands
  }

  set operands(newOps) {
    if (newOps.length == this._operands.length) {
      this._operands = newOps
    } else {
      throw new Error(`Diffrent number of operands in instruction`)
    }
  }

  get opcode() {
    let op = Opcodes[this.opcodeName]

    if (op == null) {
      throw new Error(`Undefined opcode: ${this.opcodeName}`)
    }
    return op
  }

  get power() {
    return Opcodes.resolve(this.opcode).power
  }

  get length() {
    return this._operands ? this._operands.length + 1 : 1
  }

  haveOperands() {
    return this._operands != null && this._operands.length > 0
  }

  toJs() {
    if (this.haveOperands()) {
      return { opcode: this.opcodeName, operands: this._operands }
    } else {
      return { opcode: this.opcodeName }
    }
  }

  toBytes(bytes) {
    bytes.push(this.opcode)
    if (this.haveOperands()) {
      for (var j = 0; j < this._operands.length; j++) {
        bytes.push(this.operands[j])
      }
    }
  }

  setDebugInfo(codeLocation) {
    this.codeLocation = codeLocation
    return this
  }
}

export default class Bytecode {
  program = []
  address = 0

  constructor(context) {
    this.context = context
  }

  push(opcodeName, ...operands) {
    let instruction = new Instruction(opcodeName, operands)
    this.program.push(instruction)
    this.address += instruction.length
    return instruction
  }

  get nextAddress() {
    return this.address + 1
  }

  get(index) {
    return this.program[index]
  }

  toArray() {
    return this.program.map((instruction) => instruction.toJs())
  }

  toBlob() {
    throw "Implement generation of blob"
  }

  toProgram() {
    let code = []
    let sourceMap = {}

    for (var i = 0; i < this.program.length; i++) {
      this.program[i].resolve(this.context)
    }

    for (var i = 0; i < this.program.length; i++) {
      let instruction = this.program[i]
      if (instruction.codeLocation != null) {
        sourceMap[code.length] = instruction.codeLocation
      }
      
      instruction.toBytes(code)
    }

    return { code, sourceMap }
  }

  get powerUsage() {
    let power = 0
    for (var i = 0; i < this.program.length; i++) {
      power += this.program[i].power
    }
    return power
  }
}
