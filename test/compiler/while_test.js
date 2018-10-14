import { expect } from 'chai'
import { loadAndcompile, compile } from '../helpers'

describe('while', function () {
  it('a < 10', loadAndcompile('./test/factories/inc_loop.tank', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(10)
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize a | 1
      { opcode: 'Store', operands: [1] }, // | 3

      { opcode: 'Push', operands: [0] }, // set a to 0 | 5
      { opcode: 'Store', operands: [1] }, // | 7

      { opcode: 'Jmp', operands: [17] }, // jmp to condition | 9

      { opcode: 'Load', operands: [1] }, // load a | 11
      { opcode: 'Push', operands: [1] }, // push 1 to stack | 13
      { opcode: 'Add' }, // Add it | 14
      { opcode: 'Store', operands: [1] }, // save it to a | 16

      { opcode: 'Load', operands: [1] }, // load a | 18
      { opcode: 'Push', operands: [10] }, // push 10 for compare | 20
      { opcode: 'IsGte' }, // check of a > 10 | 21
      { opcode: 'Not' }, // negate it | 22
      { opcode: 'Jif', operands: [10] }, // jump to loop block | 24
      
      { opcode: 'Halt' } // | 25
    ])
  }))

  it('(false)', loadAndcompile('./test/factories/false_loop.tank', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(0)
  }))

  it('nested loops', loadAndcompile('./test/factories/nested_loop.tank', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(10)
    expect(vm.frame.get(2)).to.eq(100)
  }))

  it('can break the repeat loop', compile('let a = 0; while(a < 100) { a = a+5; break; a = a+100; }', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(5)
  }))
})
