import { expect } from 'chai'
import { withVM } from '../helpers'
import Opcodes from '../../app/javascript/packs/lang/opcodes'

describe('flow', function() {
  it('Halt', withVM([Opcodes.Halt, Opcodes.Push], function(vm) {
    expect((vm.step())).to.be.false
    expect(::vm.step).to.throw(/VM is halted!/)
    expect(vm.ip).to.eq(1)
    expect(vm.halted).to.be.true
    expect(vm.stack.toArray()).to.be.empty
  }))

  describe('Jmp', function() {
    it('set ip to address', withVM([Opcodes.Push, 1, Opcodes.Jmp, 0], function(vm) {
      vm.step()
      expect(vm.ip).to.eq(2)
      vm.step()
      expect(vm.ip).to.eq(0)
    }))

    it('throws error if trying to jump to something other than address', withVM([Opcodes.Jmp, 'sss'], function(vm) {
      expect(::vm.step).to.throw(/Address sss is invalid/)
    }))

    it('requires address operand', withVM([Opcodes.Jmp], function(vm) {
      expect(::vm.step).to.throw(/Should have the instruction address after the Jmp instruction/)
    }))
  })

  describe('Jif', function() {
    it('jump if true', withVM([Opcodes.Push, 1, Opcodes.Jif, 0], function(vm) {
      vm.step()
      expect(vm.ip).to.eq(2)
      vm.step()
      expect(vm.ip).to.eq(0)
      expect(vm.halted).to.be.false
    }))

    it('dont jump if false', withVM([Opcodes.Push, 0, Opcodes.Jif, 0], function(vm) {
      expect((vm.step())).to.be.true
      expect((vm.step())).to.be.false
      expect(vm.halted).to.be.true
    }))

    it('requires address operand', withVM([Opcodes.Jif], function(vm) {
      vm.stack.set([2])
      expect(::vm.step).to.throw(/Should have the instruction address after the Jif instruction/)
    }))

    it('requires value on stack', withVM([Opcodes.Jif], function(vm) {
      expect(::vm.step).to.throw(/Stack underflow error/)
    }))
  })
})

