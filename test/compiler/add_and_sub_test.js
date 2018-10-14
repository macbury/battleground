import { expect } from 'chai'
import { readFileSync } from 'fs'
import { loadAndcompile } from '../helpers'

describe('Add number and sub', function () {
  it('generate byte code', loadAndcompile('./test/factories/add_and_sub.tank', function (vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(4)
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize c
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [2] }, // push 3
      { opcode: 'Push', operands: [3] }, // push 2
      { opcode: 'Add' }, // sum 2 + 3

      { opcode: 'Push', operands: [1] }, // push 3
      { opcode: 'Sub' }, // sum 5 - 1

      { opcode: 'Store', operands: [1] }, // save 4 into c
      { opcode: 'Halt' }
    ])
  }))
})
