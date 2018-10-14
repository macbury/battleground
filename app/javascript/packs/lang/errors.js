export class VmError extends Error {}

export class OutOfPower extends VmError {
  constructor() {
    super('Out of power')
  }
}

export class UndefinedVariable extends VmError {
  constructor(varNumber) {
    super(`Could not find variable ${varNumber} in frame`)
  }
}

export class MissingCall extends VmError {
  constructor() {
    super('Missing Call instruction')
  }
}

export class CallStackOverflow extends VmError {
  constructor() {
    super('Call Stack overflow error...')
  }
}

export class StackOverflow extends VmError {
  constructor() {
    super('Stack overflow error...')
  }
}

export class StackUnderflow extends VmError {
  constructor() {
    super('Stack underflow error...')
  }
}

export class InvalidStackType extends VmError {
  constructor(value, requiredType) {
    super(`Expected ${value} to be type of ${requiredType}`)
  }
}

export class InvalidPushType extends VmError {
  constructor() {
    super('You can only push number and string to stack')
  }
}

export function assert(condition, message) {
  if (!condition) {
    throw new VmError(message)
  }
}
