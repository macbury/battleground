import { Base } from './base'
import { Type } from './values'

export class CastVariable extends Base {
  constructor(targetType, expression) {
    super()
    this.targetType = targetType
    this.expression = expression
  }

  analyze(context) {
    this.expression.analyze(context)
  }

  compile(bytecode) {
    this.expression.compile(bytecode)
    
    if (this.targetType == Type.text) {
      bytecode.push('ToString').setDebugInfo(this.codeLocation)
    } else if (this.targetType == Type.number) {
      bytecode.push('ToNumber').setDebugInfo(this.codeLocation)
    } else if (this.targetType == Type.boolean) {
      bytecode.push('ToBoolean').setDebugInfo(this.codeLocation)
    } else {
      throw new Error(`Unsupported type: ${this.targetType.name}`)
    }
  }

  get type() {
    return this.targetType
  }
}
