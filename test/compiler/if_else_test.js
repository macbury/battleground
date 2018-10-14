import { expect } from 'chai'
import { loadAndcompile } from '../helpers'

describe('if else', function () {
  it('eval if block', loadAndcompile('./test/factories/positive_if_else.tank', function(vm, bytecode) {
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize exp
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [1] }, // set exp to true
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [1] },  // load if expression to stack(in this case if (true))
      { opcode: 'Not' }, // negate true to false
      { opcode: 'Jif', operands: [19] }, // jump to ignore if else block

      { opcode: 'Push', operands: [2] },// if block
      { opcode: 'Store', operands: [1] }, // store 2 to exp
      { opcode: 'Jmp', operands: [23] }, // jmp after else block

      { opcode: 'Push', operands: [3] },// else block
      { opcode: 'Store', operands: [1] }, // store 3 to exp
      
      { opcode: 'Halt' }
    ])
    expect(vm.frame.get(1)).to.deep.eq(2)
  }))

  it('eval else block', loadAndcompile('./test/factories/negative_if_else.tank', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(3)
  }))
})
