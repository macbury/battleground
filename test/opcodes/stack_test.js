import { expect } from 'chai'
import { withVM } from '../helpers'
import Opcodes from '../../app/javascript/packs/lang/opcodes'


describe('stack', function() {
  it('Pop', withVM([Opcodes.Pop], function(vm) {
    vm.stack.set([33])
    expect((vm.step())).to.be.false
    expect(vm.ip).to.eq(1)
    expect(vm.halted).to.be.true
    expect(vm.stack.toArray()).to.deep.empty
  }))

  it('Push', withVM([Opcodes.Push, 2], function(vm) {
    expect((vm.step()), "to be final step").to.be.false
    expect(vm.ip).to.eq(2)
    expect(vm.halted, "to be halted").to.be.true
    expect(vm.stack.toArray()).to.deep.eq([2])
  }))

  it('Dup', withVM([Opcodes.Dup], function(vm) {
    vm.stack.set([11])
    expect((vm.step()), "to be final step").to.be.false
    expect(vm.ip).to.eq(1)
    expect(vm.halted, "to be halted").to.be.true
    expect(vm.stack.toArray()).to.deep.eq([11, 11])
  }))
})
