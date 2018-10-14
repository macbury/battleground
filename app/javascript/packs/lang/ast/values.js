import { Base } from './base'

class Value extends Base {
  constructor(type, value) {
    super()
    this.content = value
    this.type = type
  }

  get() {
    return this.content
  }

  compile(bytecode) {
    bytecode.push('Push', this.content).setDebugInfo(this.codeLocation)
  }
}

export class Number extends Value {
  constructor(value) {
    super(Type.number, parseInt(value))
  }
}

export class Text extends Value {
  constructor(value) {
    super(Type.text, value.toString())
  }
}

export class Boolean extends Value {
  constructor(value) {
    super(Type.boolean, value == 'true' ? 1 : 0)
  }
}

export class ArrayValue extends Base {

}

class TypeDef extends Base {
  constructor(name, defaultValue, builder) {
    super()
    this._defaultValue = defaultValue
    this.builder = builder
    this.name = name
  }

  get defaultValue() {
    return this._defaultValue
  }

  isEq(otherType) {
    return (this == otherType)
  }
}

const Type = {
  text: new TypeDef('text', '', Text),
  number: new TypeDef('number', 0, Number),
  boolean: new TypeDef('boolean', 0, Boolean),
  method: new TypeDef('method', 0, null),
  none: new TypeDef('none', 0, null),
  array: new TypeDef('array', [], ArrayValue),

  for: (name) => {
    if (Type[name] == null) {
      throw new Error(`Undefined type: ${name}`)
    }
    return Type[name]
  }
}

export { Type }
