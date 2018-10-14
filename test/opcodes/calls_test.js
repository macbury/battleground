import { expect } from 'chai'
import { withVM } from '../helpers'
import Opcodes from '../../app/javascript/packs/lang/opcodes'

describe('Call', function() {
  it('it moves to new function', withVM([Opcodes.Call, 0], function(vm) {
    vm.step()
    expect(vm.ip).to.eq(0)
    expect(vm.frames.length).to.eq(2)
    expect(vm.frame.returnAddress).to.eq(2)
  }))

  it('requires address operand', withVM([Opcodes.Call], function(vm) {
    expect(::vm.step).to.throw(/Should have the instruction address after the Call instruction/)
  }))

  it('requires valid address', withVM([Opcodes.Call, 1000], function(vm) {
    expect(::vm.step).to.throw(/Address 1000 is outside of program/)
  }))

  it('doubles values', withVM([
    Opcodes.Push, 3, 
    Opcodes.Call, 5, 
    Opcodes.Halt, 
    Opcodes.Push, 2, 
    Opcodes.Mul, 
    Opcodes.Ret
  ], function(vm) {
    vm.run()
    expect(vm.stack.toArray()).to.deep.eq([6])
  }))
})

describe('Ret', function() {
  it('it allows return to place of call', withVM([Opcodes.Call, 3, Opcodes.Halt, Opcodes.Ret], function(vm) {
    expect((vm.step())).to.be.true
    expect(vm.frames.length).to.eq(2)
    expect(vm.ip).to.eq(3)
    expect((vm.step())).to.be.true
    expect(vm.ip).to.eq(2)
    expect(vm.frames.length).to.eq(1)
    expect((vm.step())).to.be.false

    expect(vm.ip).to.eq(3)
  }))

  it('prevents return if no call has been triggered', withVM([Opcodes.Ret], function(vm) {
    expect(::vm.step).to.throw(/Missing Call instruction/)
  }))
})
