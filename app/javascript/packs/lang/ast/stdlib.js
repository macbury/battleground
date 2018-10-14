import { Base } from './base'
import { Type } from './values'

class StdLibMethod extends Base {
  constructor(opcodeName, methodName, requiredArgsTypes, args) {
    super()
    this.methodName = methodName
    this.requiredArgsTypes = requiredArgsTypes
    this.args = args
    this.opcodeName = opcodeName
  }

  analyze(context) {
    this.args.forEach((arg) => arg.analyze(context))

    this.assert(this.requiredArgsTypes.length == this.args.length, `Method ${this.methodName} have ${this.requiredArgsTypes.length} arguments but you passed ${this.args.length}`)
    for (let i = 0; i < this.requiredArgsTypes.length; i++) {
      let requiredArgType = this.requiredArgsTypes[i]
      let passedArg = this.args[i]
      this.assert(requiredArgType.isEq(passedArg.type), `Argument number ${i+1} should be ${requiredArgType.name} but is ${passedArg.type.name} for method ${this.methodName}`)
    }
  }

  compile(bytecode) {
    this.args.forEach((arg) => arg.compile(bytecode))
    bytecode.push(this.opcodeName).setDebugInfo(this.codeLocation)
  }

  get type() {
    return Type.none
  }
}

class StdLibMethodVoid extends StdLibMethod {
  compile(bytecode) {
    super.compile(bytecode)
    bytecode.push('Push', 0)
  }
}

export class WaitMethod extends StdLibMethodVoid {
  constructor(args) {
    super('Slp', 'wait', [Type.number], args)
  }
}

export class MessageMethod extends StdLibMethodVoid {
  constructor(args) {
    super('Print', 'message', [Type.text], args)
  }
}

export class MoveMethod extends StdLibMethod {
  constructor(args) {
    super('Mov', 'move', [Type.number], args)
  }

  get type() {
    return Type.boolean
  }
}

export class TurnMethod extends StdLibMethodVoid {
  constructor(args) {
    super('Trn', 'turn', [Type.number], args)
  }
}

export class RotateCannonMethod extends StdLibMethodVoid {
  constructor(args) {
    super('Roc', 'rotateCannon', [Type.number], args)
  }
}

export class FireMethod extends StdLibMethodVoid {
  constructor(args) {
    super('Fie', 'fire', [], args)
  }
}
