import OpcodesBuilder from './opcode_builder'
import { assert } from './errors'
function sameType(a, b) {
  return typeof(a) == typeof(b)
}

function validateDegree(degree) {
  let absoluteDegrees = Math.abs(degree)
  assert(absoluteDegrees <= 360, `Degree value can be only in range -360 to 360 but was ${degree}`)
}

const Opcodes = new OpcodesBuilder()
export default Opcodes

Opcodes.register('Halt', function(vm) {
  vm.halted = true
}).setCharge(0)

Opcodes.register('Push', function(vm) {
  let value = vm.next("Should have the value after the Push instruction")
  vm.stack.push(value)
}).setCharge(2)

Opcodes.register('Pop', function(vm) {
  vm.stack.pop()
}).setCharge(2)

Opcodes.register('Dup', function(vm) {
  vm.stack.push(vm.stack.peek())
}).setCharge(3)

Opcodes.register('Add', function(vm) {
  let right = vm.stack.popNumber()
  let left = vm.stack.popNumber()
  vm.stack.push(left + right)
}).setCharge(3)

Opcodes.register('Sub', function(vm) {
  let right = vm.stack.popNumber()
  let left = vm.stack.popNumber()
  vm.stack.push(left - right)
}).setCharge(3)

Opcodes.register('Mul', function(vm) {
  let right = vm.stack.popNumber()
  let left = vm.stack.popNumber()
  vm.stack.push(left * right)
}).setCharge(5)

Opcodes.register('Div', function(vm) {
  let right = vm.stack.popNumber()
  let left = vm.stack.popNumber()
  vm.stack.push(left / right)
}).setCharge(5)

Opcodes.register('Not', function(vm) {
  let value = vm.stack.popBoolean()
  vm.stack.push(!value)
}).setCharge(2)

Opcodes.register('And', function(vm) {
  let right = vm.stack.popBoolean()
  let left = vm.stack.popBoolean()
  vm.stack.push(left && right)
}).setCharge(2)

Opcodes.register('Or', function(vm) {
  let right = vm.stack.popBoolean()
  let left = vm.stack.popBoolean()
  vm.stack.push(left || right)
}).setCharge(2)

Opcodes.register('IsEq', function(vm) {
  let right = vm.stack.pop()
  let left = vm.stack.pop()
  vm.stack.push(sameType(left, right) && left === right)
}).setCharge(2)

Opcodes.register('IsGt', function(vm) {
  let right = vm.stack.popNumber()
  let left = vm.stack.popNumber()
  vm.stack.push(sameType(left, right) && left > right)
}).setCharge(2)

Opcodes.register('IsGte', function(vm) {
  let right = vm.stack.popNumber()
  let left = vm.stack.popNumber()
  vm.stack.push(sameType(left, right) && left >= right)
}).setCharge(2)

Opcodes.register('Load', function(vm) {
  let varNumber = vm.next("Should have the variable number after the Load instruction")
  let value = vm.frame.get(varNumber)
  vm.stack.push(value)
}).setCharge(3)

Opcodes.register('Store', function(vm) {
  let varNumber = vm.next("Should have the variable number after the Store instruction")
  vm.frame.set(varNumber, vm.stack.pop())
}).setCharge(3)

Opcodes.register('Jmp', function(vm) {
  let address = vm.next("Should have the instruction address after the Jmp instruction")
  vm.ip = address
}).setCharge(8)

Opcodes.register('Jif', function(vm) {
  let left = vm.stack.popBoolean()
  let address = vm.next("Should have the instruction address after the Jif instruction")
  if (left) {
    vm.ip = address
  }
}).setCharge(10)

Opcodes.register('Call', function(vm) {
  let address = vm.next("Should have the instruction address after the Call instruction")
  vm.frames.push(vm.ip)
  vm.ip = address
}).setCharge(40)

Opcodes.register('Ret', function(vm) {
  vm.ip = vm.frames.pop()
}).setCharge(5)

Opcodes.register('Print', function(vm) {
  let message = vm.stack.pop().toString()
  vm.charge(2 * message.length)
  vm.events.emit('message', message.toString())
}).setCharge(15)

Opcodes.register('ToNumber', function(vm) {
  let value = parseInt(vm.stack.pop()) || 0
  vm.stack.push(value)
}).setCharge(3)

Opcodes.register('ToBoolean', function(vm) {
  let value = parseInt(vm.stack.pop())
  vm.stack.push(value == 1 ? 1 : 0)
}).setCharge(3)

Opcodes.register('ToString', function(vm) {
  let value = vm.stack.pop().toString()
  vm.stack.push(value)
}).setCharge(3)

Opcodes.register('Rnd', function(vm) {
  let right = vm.stack.popNumber()
  let left = vm.stack.popNumber()
  vm.stack.push(vm.random.between(left, right))
}).setCharge(3)

Opcodes.register('Slp', function(vm) {
  let miliseconds = vm.stack.popNumber()
  assert(miliseconds > 0.0, `Sleep time must be above 0, but was: ${miliseconds}`)
  assert(miliseconds <= 60000, `Max sleep time is 60 seconds!`)
  vm.waitForEvent('sleep:end')
  vm.emit('sleep:start', miliseconds)
}).setCharge(1)

Opcodes.register('Mov', function(vm) {
  let meters = vm.stack.popNumber()
  let absoluteMeters = Math.abs(meters)
  assert(absoluteMeters <= 100, `You can move at once 100 meters, but you wanted to move: ${meters}`)

  vm.pause()
  vm.events.once('move:end', (success) => {
    vm.stack.push(success)
    vm.resume()
  })
  vm.emit('move:start', meters)
}).setCharge(15)

Opcodes.register('Trn', function(vm) {
  let degree = vm.stack.popNumber()
  validateDegree(degree)
  vm.waitForEvent('turn:end')
  vm.emit('turn:start', degree)
}).setCharge(15)

Opcodes.register('Roc', function (vm) {
  let degree = vm.stack.popNumber()
  validateDegree(degree)

  vm.waitForEvent('rotateCannon:end')
  vm.emit('rotateCannon:start', degree)
}).setCharge(15)

Opcodes.register('Fie', function(vm) {
  vm.waitForEvent('fire:end')
  vm.emit('fire:start')
}).setCharge(15)
