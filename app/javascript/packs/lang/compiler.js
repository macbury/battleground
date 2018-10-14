import ohm from 'ohm-js'
import { GRAMMAR_SRC } from './grammar'
import { generateAst } from './ast'
import Context from './ast/context'
import ByteCode from './ast/bytecode'
import { getLineAndColumn } from 'ohm-js/src/util'

class CompilationError extends Error {
  constructor(match) {
    super(`Could not compile: ${match.message}`)
    this.match = match

    let lineInfo = getLineAndColumn(match.input, match.getRightmostFailurePosition())
    this.codeLocation = {
      source: match.input,
      content: match.input,
      ...lineInfo
    }
  }
}

export default class Compiler {
  static compile(content) {
    let compiler = new Compiler()
    let bytecode = compiler.compile(content)
    let { sourceMap, code } = bytecode.toProgram()
    return code
  }

  constructor() {
    this.grammar = ohm.grammar(GRAMMAR_SRC)
    this.semantic = this.grammar.createSemantics()
    this.semantic.addOperation('toAst', generateAst)
  }

  generateAst(src) {
    let match = this.grammar.match(src)

    if (match.succeeded()) {
      let context = new Context(null)
      let ast = this.semantic(match).toAst()
      ast.analyze(context)
      return { ast, context }
    } else {
      throw new CompilationError(match)
    }
  }

  compile(src) {
    let { ast, context } = this.generateAst(src)
    let bytecode = new ByteCode(context)
    ast.compile(bytecode)
    return bytecode
  }
}
