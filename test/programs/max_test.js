import { expect } from 'chai'
import { withVM } from '../helpers'
import Opcodes from '../../app/javascript/packs/lang/opcodes'

describe('VirtualMachine', function() {
  it('maxAB', withVM([
    Opcodes.Push, 6,        // Push the first argument
    Opcodes.Push, 4,        // Push the second argument
    Opcodes.Call, 7,        // Call "max"
    Opcodes.Halt,
    // Here is address 7, the start of "max" function
    Opcodes.Store, 1,       // Store b in local variable 1; the stack now contains [a]
    Opcodes.Store, 0,       // Store a in local variable 0; the stack is now empty
    Opcodes.Load, 0,        // The stack now contains [a]
    Opcodes.Load, 1,        // The stack now contains [a, b]
    Opcodes.IsGt,           // The stack now contains [a > b]
    Opcodes.Jif, 21,        // If the top of the stack is true (a > b), jump to the "if" path
    Opcodes.Load, 1,        // "else" path: load b on the stack
    Opcodes.Ret,
    // Here is address 23
    Opcodes.Load, 0,        // "if" path: load a on the stack
    Opcodes.Ret
  ], function(vm) {
    vm.run()
    expect(vm.stack.toArray()).to.deep.eq([6])
    expect(vm.ip).to.eq(7)
  }))
})
