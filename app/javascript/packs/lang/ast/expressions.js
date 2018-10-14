import { Base } from './base'
import { Type } from './values'

class Expression extends Base {
  constructor(left, operator, right) {
    super()
    this.left = left
    this.right = right
    this.operator = operator
  }

  analyze(context) {
    this.left.analyze(context)
    this.right.analyze(context)

    this.assert(
      this.left.type.isEq(this.right.type),
      `Left expression is ${this.left.type.name} type and right is ${this.right.type.name} type`
    )
  }

  compile(bytecode) {
    this.left.compile(bytecode)
    this.right.compile(bytecode)
  }

  get type() {
    return this.left.type
  }
}

export class LogicExpression extends Expression {
  compile(bytecode) {
    super.compile(bytecode)

    if (this.operator == 'or') {
      bytecode.push('Or').setDebugInfo(this.codeLocation)
      return
    }

    if (this.operator == 'and') {
      bytecode.push('And').setDebugInfo(this.codeLocation)
      return
    }

    throw new Error(`Unsuported operator: ${this.operator}`)
  }

  get type() {
    return Type.boolean
  }
}

export class CompareExpression extends Expression {

  compile(bytecode) {
    super.compile(bytecode)

    if (this.operator == '==') {
      bytecode.push('IsEq').setDebugInfo(this.codeLocation)
      return
    }

    if (this.operator == '!=') {
      bytecode.push('IsEq').setDebugInfo(this.codeLocation)
      bytecode.push('Not').setDebugInfo(this.codeLocation)
      return
    }

    if (this.operator == '>=') {
      bytecode.push('IsGte').setDebugInfo(this.codeLocation)
      return
    }

    if (this.operator == '>') {
      bytecode.push('IsGt').setDebugInfo(this.codeLocation)
      return
    }

    if (this.operator == '<') {
      bytecode.push('IsGte').setDebugInfo(this.codeLocation)
      bytecode.push('Not').setDebugInfo(this.codeLocation)
      return
    }

    if (this.operator == '<=') {
      bytecode.push('IsGt').setDebugInfo(this.codeLocation)
      bytecode.push('Not').setDebugInfo(this.codeLocation)
      return
    }

    throw new Error(`Unsuported operator: ${this.operator}`)
  }

  get type() {
    return Type.boolean
  }
}

export class UnaryExpression extends Base {
  constructor(expression, operator) {
    super()
    this.expression = expression
    this.operator = operator
  }

  analyze(context) {
    this.expression.analyze(context)
  }

  compile(bytecode) {
    this.expression.compile(bytecode)
    if (this.operator == 'not') {
      bytecode.push('Not').setDebugInfo(this.codeLocation)
      return
    }

    if (this.operator == '-') {
      bytecode.push('Push', -1).setDebugInfo(this.codeLocation)
      bytecode.push('Mul').setDebugInfo(this.codeLocation)
      return
    }
    throw new Error(`Unsuported operator: ${this.operator}`) 
  }

  get type() {
    return this.expression.type
  }
}

export class AddOpExpression extends Expression {
  compile(bytecode) {
    super.compile(bytecode)

    if (this.operator == '+') {
      bytecode.push('Add').setDebugInfo(this.codeLocation)
      return
    }

    if (this.operator == '-') {
      bytecode.push('Sub').setDebugInfo(this.codeLocation)
      return
    }

    throw new Error(`Unsuported operator: ${this.operator}`)
  }
}

export class MulOpExpression extends Expression {
  compile(bytecode) {
    super.compile(bytecode)

    if (this.operator == '*') {
      bytecode.push('Mul').setDebugInfo(this.codeLocation)
      return
    }

    if (this.operator == '/') {
      bytecode.push('Div').setDebugInfo(this.codeLocation)
      return
    }

    throw new Error(`Unsuported operator: ${this.operator}`)
  }
}
