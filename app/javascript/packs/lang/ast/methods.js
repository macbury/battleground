import { Base } from './base'
import { Type } from './values'

export class ReturnVoidStatement extends Base {

  analyze(context) {
    let { parentSymbol } = context
    this.assert(parentSymbol.isMethod(), 'You can only use return inside method body')
    this.assert(parentSymbol.type == Type.none, `Method ${parentSymbol.name} returns ${parentSymbol.type.name} but you are returning ${Type.none.name}`)
  }

  compile(bytecode) {
    bytecode.push('Push', 0).setDebugInfo(this.codeLocation)
    bytecode.push('Ret').setDebugInfo(this.codeLocation)
  }
}

export class ReturnStatement extends ReturnVoidStatement {
  constructor(expression) {
    super()
    this.expression = expression
  }

  analyze(context) {
    let { parentSymbol } = context
    this.expression.analyze(context)
    this.assert(parentSymbol.isMethod(), 'You can only use return inside method body')
    this.assert(parentSymbol.type.isEq(this.expression.type), `Method ${parentSymbol.name} requires to return ${parentSymbol.type.name} but you are returning ${this.expression.type.name}`)
  }

  compile(bytecode) {
    this.expression.compile(bytecode)
    bytecode.push('Ret').setDebugInfo(this.codeLocation)
  }
}

export class Param extends Base {
  constructor(name, type) {
    super()
    this.name = name
    this.type = type
  }

  analyze(context) {
    this.assert(!context.exists(this.name), `There is already declared ${this.name}`)
    this.id = context.addSymbol(this.name, this.type).id
  }

  compile(bytecode) {
    bytecode.push('Store', this.id).setDebugInfo(this.codeLocation)
  }
}

export class DefGlobalVoidMethod extends Base {
  constructor(methodName, params, block) {
    super()
    this.methodName = methodName
    this.params = params
    this.block = block
  }

  get methodReturnType() {
    return Type.none
  }

  analyze(context) {
    this.assert(!context.exists(this.methodName), `There is already declared ${this.methodName}`)
    this.methodSymbol = context.addMethod(this.methodName, this.methodReturnType)

    this.methodContext = context.createMethodContext(this.methodSymbol)
    
    this.params.forEach((param) => param.analyze(this.methodContext))
    this.subanalyze()
    this.methodSymbol.argsTypes = this.params.map((param) => param.type)
    this.block.analyze(this.methodContext)
  }

  compile(bytecode) {
    let labelMethodBody = bytecode.push('Jmp', 0)
    this.methodSymbol.address = bytecode.address
    for (var i = this.params.length - 1; i >= 0; i--) {
      this.params[i].compile(bytecode)
    }
    this.block.compile(bytecode)

    this.subcompile(bytecode)

    labelMethodBody.operands = [bytecode.address]
    labelMethodBody.setDebugInfo(this.codeLocation)
  }

  subcompile(bytecode) {
    bytecode.push('Push', 0).setDebugInfo(this.codeLocation)
    bytecode.push('Ret').setDebugInfo(this.codeLocation)
  }

  subanalyze() {
    // for applying additional bytecode before label
  }
}

export class DefGlobalMethod extends DefGlobalVoidMethod {
  constructor(methodName, params, returnType, block) {
    super(methodName, params, block)
    this.returnType = returnType
  }

  get methodReturnType() {
    return this.returnType
  }

  subanalyze() {
    this.returnType.analyze(this.methodContext)
  }

  subcompile(bytecode) {
    bytecode.push('Push', this.returnType.defaultValue).setDebugInfo(this.codeLocation)
    bytecode.push('Ret').setDebugInfo(this.codeLocation)
  }
}

export class RunMethod extends Base {
  constructor(methodName, args) {
    super()
    this.methodName = methodName
    this.args = args
  } 

  analyze(context) {
    this.assert(context.fetchSymbol(this.methodName), `Could not find method with name: ${this.methodName}`)
    
    this.methodSymbol = context.lookupSymbol(this.methodName)
    this.assert(this.methodSymbol.isMethod(), `Could not find method with name: ${this.methodName}`)

    let requiredArgsTypes = this.methodSymbol.argsTypes

    this.args.forEach((arg) => arg.analyze(context))

    this.assert(requiredArgsTypes.length == this.args.length, `Method ${this.methodName} have ${requiredArgsTypes.length} arguments but you passed ${this.args.length}`)
    for (let i = 0; i < requiredArgsTypes.length; i++) {
      let requiredArg = this.args[i]
      let passedArgType = requiredArgsTypes[i]
      this.assert(requiredArg.type.isEq(passedArgType), `Argument number ${i+1} should be ${requiredArg.type.name} but is ${passedArgType.name} for method ${this.methodName}`)
    }
  }

  compile(bytecode) {
    this.args.forEach((arg) => arg.compile(bytecode))
    bytecode.push('Call', this.methodSymbol.address).setDebugInfo(this.codeLocation)
  }

  get type() {
    return this.methodSymbol.type
  }
}

