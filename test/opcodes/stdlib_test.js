import { expect } from 'chai'
import { withVMAndEvents, withVM } from '../helpers'
import Opcodes from '../../app/javascript/packs/lang/opcodes'

describe('stdlib', function() {
  describe('Slp', function() {
    it('allows sleep for specific time period', withVMAndEvents([Opcodes.Slp], function(vm, events, done) {
      events.once('sleep:start', (miliseconds) => {
        expect(miliseconds).to.eq(1000)
        expect(vm.paused).to.be.true
        events.emit('sleep:end')
      })
      events.once('sleep:end', done)
      vm.stack.set([1000])
      vm.step()
      expect(vm.ip).to.eq(1)
      expect(vm.stack.toArray()).to.deep.empty
    }))

    it('prevent sleep backward in time', withVM([Opcodes.Slp], function(vm) {
      vm.stack.set([-111])
      expect(::vm.step).to.throw(/Sleep time must be above 0, but was: -111/);
    }))

    it('max one time sleep is 60 seconds', withVM([Opcodes.Slp], function(vm) {
      vm.stack.set([61*1000])
      expect(::vm.step).to.throw(/Max sleep time is 60 seconds!/);
    }))
  })

  describe('Mov', function() {
    it('allows movement in any direction', withVMAndEvents([Opcodes.Mov], function(vm, events, done) {
      events.once('move:start', (meters) => {
        expect(meters).to.eq(10)
        expect(vm.paused).to.be.true
        events.emit('move:end', true)
      })
      events.once('move:end', () => done())
      vm.stack.set([10])
      vm.step()
      expect(vm.ip).to.eq(1)
      expect(vm.stack.toArray()).to.deep.eq([1])
    }))

    it('max one time movement is 100 meters', withVM([Opcodes.Mov], function(vm) {
      vm.stack.set([101])
      expect(::vm.step).to.throw(/You can move at once 100 meters, but you wanted to move: 101/);
    }))
  })

  describe('Trn', function() {
    it('allows turn in any direction', withVMAndEvents([Opcodes.Trn], function(vm, events, done) {
      events.once('turn:start', (degrees) => {
        expect(degrees).to.eq(70)
        expect(vm.paused).to.be.true
        events.emit('turn:end')
      })
      events.once('turn:end', done)
      vm.stack.set([70])
      vm.step()
      expect(vm.ip).to.eq(1)
      expect(vm.stack.toArray()).to.deep.empty
    }))

    it('max one time movement is 360 meters', withVM([Opcodes.Trn], function(vm) {
      vm.stack.set([1540])
      expect(::vm.step).to.throw(/Degree value can be only in range -360 to 360 but was 1540/);
    }))
  })

  describe('Roc', function() {
    it('allows turn cannon in any direction', withVMAndEvents([Opcodes.Roc], function(vm, events, done) {
      events.once('rotateCannon:start', (degrees) => {
        expect(degrees).to.eq(70)
        expect(vm.paused).to.be.true
        events.emit('rotateCannon:end')
      })
      events.once('rotateCannon:end', done)
      vm.stack.set([70])
      vm.step()
      expect(vm.ip).to.eq(1)
      expect(vm.stack.toArray()).to.deep.empty
    }))

    it('max one time movement is 360 meters', withVM([Opcodes.Roc], function(vm) {
      vm.stack.set([1540])
      expect(::vm.step).to.throw(/Degree value can be only in range -360 to 360 but was 1540/);
    }))
  })


  describe('Fie', function() {
    it('dispatch a noice missle to target', withVMAndEvents([Opcodes.Fie], function(vm, events, done) {
      events.once('fire:start', () => {
        expect(vm.paused).to.be.true
        events.emit('fire:end')
      })
      events.once('fire:end', done)
      vm.stack.set([10])
      vm.step()
      expect(vm.ip).to.eq(1)
      expect(vm.stack.toArray()).not.to.deep.empty
    }))
  })
})
