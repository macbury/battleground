import { Type } from './values'

class Symbol {
  constructor(name, type, id, kind = 'variable') {
    this.name = name
    this.type = type
    this.id = id
    this.kind = kind
  }

  isMethod() {
    return this.kind == 'method'
  }

  isLabel() {
    return this.kind == 'label'
  }

  isLoop() {
    return this.name.match('@@loop')
  }
}

class LabelSymbol extends Symbol {
  constructor(prefix, id) {
    super(`@@${prefix}_${id}`, Type.none, id, 'label')

    this.address = 0
  }

  set(bytecode) {
    this.address = bytecode.address
  }
}

export default class Context {
  constructor(parent, parentSymbol) {
    this.parent = parent
    this.symbolTable = {}
    this.uuid = 0
    this._parentSymbol = parentSymbol
  }

  get root() {
    if (this.parent != null) {
      return this.parent.root
    } else {
      return this
    }
  }

  get parentSymbol() {
    if (this._parentSymbol == null && this.parent != null) {
      return this.parent.parentSymbol
    } else {
      return this._parentSymbol
    }
  }

  nextUUID() {
    if (this.parent == null) {
      this.uuid++
      return this.uuid
    } else {
      return this.parent.nextUUID()
    }
  }

  createLoopContext() {
    let label = this.addLabel('loop_end')
    return new Context(this, label)
  }

  createChildContext() {
    return new Context(this)
  }

  createMethodContext(methodSymbol) {
    return new Context(this, methodSymbol)
  }

  exists(name) {
    return this.fetchSymbol(name) != null
  }

  addLabel(prefix) {
    let sym = new LabelSymbol(prefix, this.nextUUID())
    this.root.symbolTable[sym.name] = sym 
    return sym
  }

  addSymbol(name, type) {
    this.symbolTable[name] = new Symbol(name, type, this.nextUUID())
    return this.symbolTable[name]
  }

  addMethod(name, returnType) {
    let method = this.addSymbol(name, returnType)
    method.kind = 'method'
    return method
  }

  isLabel(name) {
    return typeof(name) == 'string' && name.match(/^@@/)
  }

  lookupSymbol(name) {
    const symbol = this.fetchSymbol(name)
    if (symbol) {
      return symbol
    } else if (!this.parent) {
      throw new Error(`Symbol ${name} not found`)
    }
    return this.parent.lookupSymbol(name)
  }

  fetchSymbol(name) {
    let symbol = this.symbolTable[name]
    if (this.parent != null && symbol == null) {
      return this.parent.fetchSymbol(name)
    } else {
      return symbol
    }
  }
}
