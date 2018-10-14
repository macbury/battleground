import { expect } from 'chai'
import { withVM } from '../helpers'
import Opcodes from '../../app/javascript/packs/lang/opcodes'

describe('VirtualMachine', function() {
  it('can sum two numbers', withVM([Opcodes.Push, 1, Opcodes.Push, 2, Opcodes.Add, Opcodes.Halt], function(vm) {
    vm.run()
    expect(vm.halted).to.be.true
    expect(vm.ip).to.eq(6)
  }))

  it('it halts without halt', withVM([Opcodes.Push, 2, Opcodes.Push, 2], function(vm) {
    vm.run()
    expect(vm.halted).to.be.true
    expect(vm.ip).to.eq(4)
    expect(vm.stack.toArray()).to.deep.eq([2, 2])
  }))

  it('while', withVM([
    // Init a with "6"
    Opcodes.Push, 6,
    Opcodes.Store, 0,
    // Init b with "4"
    Opcodes.Push, 4,
    Opcodes.Store, 1,
    // Init total to 0
    Opcodes.Push, 0,
    Opcodes.Store, 2,

    // While part
    // Here is address 12
    Opcodes.Load, 1,            // Stack contains b
    Opcodes.Push, 1,            // Stack contains b, 1
    Opcodes.IsGte,               // Stack contains b >= 1
    Opcodes.Not,                // Stack contains b < 1
    Opcodes.Jif, 36,            // 36 is the address of the HALT label

    Opcodes.Load, 0,            // Stack contains a
    Opcodes.Load, 2,            // Stack contains a, total
    Opcodes.Add,                // Stack contains a + total
    Opcodes.Store, 2,           // Save in total, meaning total = a + total
    
    Opcodes.Load, 1,            // Stack contains b
    Opcodes.Push, 1,            // Stack contains b, 1
    Opcodes.Sub,                // Stack contains b - 1
    Opcodes.Store, 1,           // Save in b, meaning b = b - 1

    Opcodes.Jmp, 12,            // Go back to the start of the loop

    Opcodes.Halt
  ], function(vm) {
    vm.run()
    expect(vm.halted).to.be.true
    expect(vm.ip).to.eq(37)
  }))
})
