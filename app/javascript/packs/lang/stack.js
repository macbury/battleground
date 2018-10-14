import { StackOverflow, StackUnderflow, InvalidStackType, InvalidPushType } from './errors'

export default class Stack {
  list = []

  constructor(maxSize = 255) {
    this.maxSize = maxSize
  }

  push(obj) {
    if ((this.list.length + 1) >= this.maxSize) {
      throw new StackOverflow()
    }
    if (typeof(obj) == 'boolean') {
      this.list.push(obj ? 1 : 0)
    } else if (typeof(obj) == 'number' || typeof(obj) == 'string') {
      this.list.push(obj)
    } else {
      throw new InvalidPushType()
    }
  }

  pop() {
    if (this.list.length <= 0) {
      throw new StackUnderflow()
    }
    return this.list.pop()
  }

  peek() {
    if (this.list.length <= 0) {
      throw new StackUnderflow()
    }
    return this.list[this.size() - 1]
  }

  popNumber() {
    let value = this.pop()
    if (typeof(value) == 'number') {
      return value
    } else {
      throw new InvalidStackType(value, 'number')
    }
  }

  popBoolean() {
    let value = this.popNumber()
    return value !== 0
  }

  set(newList) {
    this.list = newList
  }

  size() {
    return this.list.length
  }

  toArray() {
    return this.list.slice()
  }
}