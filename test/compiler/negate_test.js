import { expect } from 'chai'
import { compile, loadAndcompile } from '../helpers'

describe('-exp', function () {
  it('a = -1', compile('let a : number = -1;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(-1)
    
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize eq
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [1] },
      { opcode: 'Push', operands: [-1] },
      { opcode: 'Mul' },

      { opcode: 'Store', operands: [1] }, // store true
      { opcode: 'Halt' }
    ])
  }))
})
