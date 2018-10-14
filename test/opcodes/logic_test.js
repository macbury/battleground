import { expect } from 'chai'
import { withVM } from '../helpers'
import Opcodes from '../../app/javascript/packs/lang/opcodes'

describe('logic', function() {
  describe('Not', function() {
    it('unary is not true', withVM([Opcodes.Not], function(vm) {
      vm.stack.set([1])
      expect((vm.step())).to.be.false
      expect(vm.ip).to.eq(1)
      expect(vm.halted).to.be.true
      expect(vm.stack.toArray()).to.deep.eq([0])
    }))

    it('unary is not false', withVM([Opcodes.Not], function(vm) {
      vm.stack.set([0])
      expect((vm.step())).to.be.false
      expect(vm.stack.toArray()).to.deep.eq([1])
    }))

    it('requires one element on stack', withVM([Opcodes.Not], function(vm) {
      expect(::vm.step).to.throw(/Stack underflow error/)
    }))

    it('element on stack must be a number', withVM([Opcodes.Not], function(vm) {
      vm.stack.set(['yolo'])
      expect(::vm.step).to.throw(/Expected yolo to be type of number/)
    }))
  })

  describe('And', function() {
    it('true and true gives true', withVM([Opcodes.And], function(vm) {
      vm.stack.set([1, 1])
      expect((vm.step())).to.be.false
      expect(vm.ip).to.eq(1)
      expect(vm.halted).to.be.true
      expect(vm.stack.toArray()).to.deep.eq([1])
    }))

    it('true and false gives false', withVM([Opcodes.And], function(vm) {
      vm.stack.set([1, 0])
      expect((vm.step())).to.be.false
      expect(vm.stack.toArray()).to.deep.eq([0])
    }))

    it('requires two elements on stack', withVM([Opcodes.And], function(vm) {
      expect(::vm.step).to.throw(/Stack underflow error/)
    }))

    it('element on stack must be a number', withVM([Opcodes.And], function(vm) {
      vm.stack.set(['yolo'])
      expect(::vm.step).to.throw(/Expected yolo to be type of number/)
    }))
  })

  describe('Or', function() {
    it('true or true gives true', withVM([Opcodes.Or], function(vm) {
      vm.stack.set([1, 1])
      expect((vm.step())).to.be.false
      expect(vm.ip).to.eq(1)
      expect(vm.halted).to.be.true
      expect(vm.stack.toArray()).to.deep.eq([1])
    }))

    it('true or false gives true', withVM([Opcodes.Or], function(vm) {
      vm.stack.set([1, 0])
      expect((vm.step())).to.be.false
      expect(vm.stack.toArray()).to.deep.eq([1])
    }))

    it('false or false gives false', withVM([Opcodes.Or], function(vm) {
      vm.stack.set([0, 0])
      expect((vm.step())).to.be.false
      expect(vm.stack.toArray()).to.deep.eq([0])
    }))

    it('requires two elements on stack', withVM([Opcodes.Or], function(vm) {
      expect(::vm.step).to.throw(/Stack underflow error/)
    }))

    it('element on stack must be a number', withVM([Opcodes.Or], function(vm) {
      vm.stack.set(['yolo'])
      expect(::vm.step).to.throw(/Expected yolo to be type of number/)
    }))
  })

  describe('IsEq', function() {
    it('push true if two numbers on stack are equal', withVM([Opcodes.IsEq], function(vm) {
      vm.stack.set([19, 19])
      expect((vm.step())).to.be.false
      expect(vm.ip).to.eq(1)
      expect(vm.halted).to.be.true
      expect(vm.stack.toArray()).to.deep.eq([1])
    }))

    it('push false if two values are different type', withVM([Opcodes.IsEq], function(vm) {
      vm.stack.set(['19', 19])
      expect((vm.step())).to.be.false
      expect(vm.stack.toArray()).to.deep.eq([0])
    }))

    it('push true if strings are equal', withVM([Opcodes.IsEq], function(vm) {
      vm.stack.set(['19', '19'])
      expect((vm.step())).to.be.false
      expect(vm.stack.toArray()).to.deep.eq([1])
    }))

    it('push false if two values are different', withVM([Opcodes.IsEq], function(vm) {
      vm.stack.set([11, 19])
      expect((vm.step())).to.be.false
      expect(vm.stack.toArray()).to.deep.eq([0])
    }))

    it('requires two elements on stack', withVM([Opcodes.Or], function(vm) {
      expect(::vm.step).to.throw(/Stack underflow error/)
    }))
  })

  describe('IsGt', function() {
    it('push true if left is greater than right', withVM([Opcodes.IsGt], function(vm) {
      vm.stack.set([20, 19])
      expect((vm.step())).to.be.false
      expect(vm.stack.toArray()).to.deep.eq([1])
    }))

    it('push false if right is greater than left', withVM([Opcodes.IsGt], function(vm) {
      vm.stack.set([19, 20])
      expect((vm.step())).to.be.false
      expect(vm.stack.toArray()).to.deep.eq([0])
    }))

    it('push false if two values are different type', withVM([Opcodes.IsGt], function(vm) {
      vm.stack.set(['20', 19])
      expect(::vm.step).to.throw(/Expected 20 to be type of number/)
    }))

    it('compares only numbers', withVM([Opcodes.IsGt], function(vm) {
      vm.stack.set(['20', '19'])
      expect(::vm.step).to.throw(/Expected 19 to be type of number/)
    }))

    it('requires two elements on stack', withVM([Opcodes.IsGt], function(vm) {
      expect(::vm.step).to.throw(/Stack underflow error/)
    }))
  })

  describe('IsGte', function() {
    it('push true if left is equal right', withVM([Opcodes.IsGte], function(vm) {
      vm.stack.set([20, 20])
      expect((vm.step())).to.be.false
      expect(vm.stack.toArray()).to.deep.eq([1])
    }))

    it('push true if left is greater than right', withVM([Opcodes.IsGte], function(vm) {
      vm.stack.set([20, 19])
      expect((vm.step())).to.be.false
      expect(vm.stack.toArray()).to.deep.eq([1])
    }))

    it('push false if right is greater than left', withVM([Opcodes.IsGte], function(vm) {
      vm.stack.set([19, 20])
      expect((vm.step())).to.be.false
      expect(vm.stack.toArray()).to.deep.eq([0])
    }))

    it('push false if two values are different type', withVM([Opcodes.IsGte], function(vm) {
      vm.stack.set(['20', 19])
      expect(::vm.step).to.throw(/Expected 20 to be type of number/)
    }))

    it('compares only numbers', withVM([Opcodes.IsGte], function(vm) {
      vm.stack.set(['20', '19'])
      expect(::vm.step).to.throw(/Expected 19 to be type of number/)
    }))

    it('requires two elements on stack', withVM([Opcodes.IsGte], function(vm) {
      expect(::vm.step).to.throw(/Stack underflow error/)
    }))
  })
})
