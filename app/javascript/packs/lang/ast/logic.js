import { Base } from './base'

export class IfStatement extends Base {
  constructor(expression, block) {
    super()
    this.expression = expression
    this.block = block
  }

  analyze(context) {
    this.expression.analyze(context)
    this.block.analyze(context)
  }

  compile(bytecode) {
    this.expression.compile(bytecode)
    bytecode.push('Not').setDebugInfo(this.codeLocation)

    let ifLabel = bytecode.push('Jif', 0)
    this.block.compile(bytecode)
    ifLabel.operands = [bytecode.address]
    ifLabel.setDebugInfo(this.codeLocation)
  }
}

export class IfElseStatement extends Base {
  constructor(expression, ifBlock, elseBlock) {
    super()
    this.expression = expression
    this.ifBlock = ifBlock
    this.elseBlock = elseBlock
  }

  analyze(context) {
    this.expression.analyze(context)
    this.ifBlock.analyze(context)
    this.elseBlock.analyze(context)
  }

  compile(bytecode) {
    this.expression.compile(bytecode)
    bytecode.push('Not').setDebugInfo(this.codeLocation)
    let elseLabel = bytecode.push('Jif', 0)
    elseLabel.setDebugInfo(this.codeLocation)
    this.ifBlock.compile(bytecode)
    let ifLabel = bytecode.push('Jmp', 0)
    elseLabel.operands = [bytecode.address]
    this.elseBlock.compile(bytecode)
    ifLabel.operands = [bytecode.address]
    ifLabel.setDebugInfo(this.codeLocation)
  }
}
