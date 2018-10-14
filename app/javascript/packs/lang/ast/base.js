import { getLineAndColumn } from 'ohm-js/src/util'

export class CompileError extends Error {
  constructor(message, location) {
    super(`${message} at line ${location.lineNum}`)
    this.codeLocation = location
  }
}

export class Base {
  analyze(context) {
    // first step, prepare variables, loops etc...
  }

  compile(bytecode) {
    // second step done after analyze is complete
    // generete here bytecode
  }

  enrichWithDebugInformation(semanticNode) {
    let { startIdx, sourceString, contents } = semanticNode.source

    let lineInfo = getLineAndColumn(sourceString, startIdx)
    this.codeLocation = {
      source: sourceString,
      content: contents,
      ...lineInfo
    }
    return this
  }

  assert(condition, message) {
    if (!condition) {
      throw new CompileError(message, this.codeLocation)  
    }
  }
}

export class Program extends Base {
  constructor(block) {
    super()
    this.block = block
  }

  compile(bytecode) {
    this.block.compile(bytecode)
    bytecode.push('Halt').setDebugInfo(this.codeLocation)
  }

  analyze(context) {
    this.block.analyze(context)
  }
}

export class StackPop extends Base {
  compile(bytecode) {
    bytecode.push('Pop')
  } 
}

export class Block extends Base {
  constructor(statements) {
    super()
    this.statements = statements
  }

  analyze(context) {
    this.statements.forEach((statement) => statement.analyze(context))
  }

  compile(bytecode) {
    this.statements.forEach((statement) => statement.compile(bytecode))
  }
}

export class LocalBlock extends Block {
  analyze(context) {
    super.analyze(context.createChildContext())
  }
}

/**
* Join multiple nodes into one
*/
export class Joiner extends Base {
  constructor(...nodes) {
    super()
    this.nodes = nodes
  }

  analyze(context) {
    this.nodes.forEach((node) => node.analyze(context))
  }

  compile(bytecode) {
    this.nodes.forEach((node) => node.compile(bytecode))
  }
}
