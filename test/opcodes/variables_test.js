import { expect } from 'chai'
import { withVM } from '../helpers'
import Opcodes from '../../app/javascript/packs/lang/opcodes'

describe('variables', function() {
  describe('Load', function() {
    it('push loaded value to stack', withVM([Opcodes.Load, 5], function(vm) {
      vm.frame.set(5, 'my value')
      expect(vm.step()).to.be.false
      expect(vm.ip).to.eq(2)
      expect(vm.halted).to.be.true
      expect(vm.stack.toArray()).to.deep.eq(['my value'])
    }))

    it('requires existing variable', withVM([Opcodes.Load, 11], function(vm) {
      expect(::vm.step).to.throw(/Could not find variable 11 in frame/)
    }))

    it('requires one operand', withVM([Opcodes.Load], function(vm) {
      expect(::vm.step).be.throw(/Should have the variable number after the Load instruction/)
    }))
  })

  describe('Store', function() {
    it('pop value from stack and store in frame', withVM([Opcodes.Store, 10], function(vm) {
      vm.stack.set([666])
      expect((vm.step())).to.be.false
      expect(vm.stack.toArray()).to.be.empty
      expect(vm.frame.get(10)).to.eq(666)
    }))

    it('requires one element on stack', withVM([Opcodes.Store, 10], function(vm) {
      expect(::vm.step).be.throw(/Stack underflow error/)
    }))

    it('requires one operand', withVM([Opcodes.Store], function(vm) {
      expect(::vm.step).be.throw(/Should have the variable number after the Store instruction/)
    }))
  })
})
