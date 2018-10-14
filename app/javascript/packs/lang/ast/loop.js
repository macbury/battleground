import { Base } from './base'

export class BreakStatement extends Base {
  analyze(context) {
    this.loopSymbol = context.parentSymbol
    this.assert(this.loopSymbol != null && this.loopSymbol.isLoop(), 'break can be used only inside loops')
  }

  compile(bytecode) {
    bytecode.push('Jmp', this.loopSymbol.name).setDebugInfo(this.codeLocation)
  }
}

export class WhileStatement extends Base {
  constructor(expression, block) {
    super()
    this.expression = expression
    this.block = block
  }

  analyze(context) {
    let loopContext = context.createLoopContext()
    this.loopStartLabel = loopContext.addLabel('loop_begin')
    this.loopConditionalLabel = loopContext.addLabel('loop_condition')
    this.loopEndSymbol = loopContext.parentSymbol
    this.expression.analyze(context)
    this.block.analyze(loopContext)
  }

  compile(bytecode) {
    bytecode.push('Jmp', this.loopConditionalLabel.name).setDebugInfo(this.codeLocation)
    this.loopStartLabel.set(bytecode)

    this.block.compile(bytecode)

    this.loopConditionalLabel.set(bytecode)

    this.expression.compile(bytecode)
    bytecode.push('Jif', this.loopStartLabel.name).setDebugInfo(this.codeLocation)
    this.loopEndSymbol.set(bytecode)
  }
}

export class LoopStatement extends Base {
  constructor(block) {
    super()
    this.block = block
  }

  analyze(context) {
    let loopContext = context.createLoopContext()
    this.loopStartLabel = loopContext.addLabel('loop_begin')
    this.loopEndSymbol = loopContext.parentSymbol
    this.block.analyze(loopContext)
  }

  compile(bytecode) {
    this.loopStartLabel.set(bytecode)
    this.block.compile(bytecode)
    bytecode.push('Jmp', this.loopStartLabel.name).setDebugInfo(this.codeLocation)
    this.loopEndSymbol.set(bytecode)
  }
}

export class RepeatStatement extends Base {
  constructor(times, block) {
    super()
    this.times = times
    this.block = block
  }

  analyze(context) {
    let loopContext = context.createLoopContext()
    this.loopStartLabel = loopContext.addLabel('loop_begin')
    this.loopConditionalLabel = loopContext.addLabel('loop_condition')
    this.loopEndSymbol = loopContext.parentSymbol
    this.block.analyze(loopContext)
    this.incVarUUID = context.nextUUID()
  }

  compile(bytecode) {
    bytecode.push('Push', this.times.get())
    bytecode.push('Store', this.incVarUUID)

    bytecode.push('Jmp', this.loopConditionalLabel.name).setDebugInfo(this.codeLocation)

    this.loopStartLabel.set(bytecode)
    this.block.compile(bytecode)

    this.loopConditionalLabel.set(bytecode)
    bytecode.push('Load', this.incVarUUID).setDebugInfo(this.codeLocation)
    bytecode.push('Push', 1).setDebugInfo(this.codeLocation)
    bytecode.push('Sub').setDebugInfo(this.codeLocation)
    bytecode.push('Store', this.incVarUUID).setDebugInfo(this.codeLocation)

    bytecode.push('Load', this.incVarUUID).setDebugInfo(this.codeLocation)
    bytecode.push('Push', 0).setDebugInfo(this.codeLocation)
    bytecode.push('IsGte').setDebugInfo(this.codeLocation)
    
    bytecode.push('Jif', this.loopStartLabel.name).setDebugInfo(this.codeLocation)
    this.loopEndSymbol.set(bytecode)
  }
}
