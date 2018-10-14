import { expect } from 'chai'
import { loadAndcompile } from '../helpers'

describe('-', function () {
  it('sub variable', loadAndcompile('./test/factories/multi_var_operation.tank', function(vm, bytecode) {
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize someVal
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [13] }, // set someVal to 13
      { opcode: 'Store', operands: [1] },

      { opcode: 'Push', operands: [0] }, // initialize result
      { opcode: 'Store', operands: [2] },

      { opcode: 'Load', operands: [1] }, // load someVal
      { opcode: 'Push', operands: [20] }, // push 20
      { opcode: 'Sub' }, // sub 13 - 20

      { opcode: 'Store', operands: [2] }, // save -7 into result

      { opcode: 'Halt' }
    ])

    expect(vm.frame.get(2)).to.deep.eq(-7)
  }))
})
