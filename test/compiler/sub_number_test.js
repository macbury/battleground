import { expect } from 'chai'
import { readFileSync } from 'fs'
import { loadAndcompile } from '../helpers'

describe('-', function () {
  it('generate byte code', loadAndcompile('./test/factories/sub_number.tank', function (vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(-2)
    expect(vm.stack.toArray()).to.be.empty
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize c
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [3] }, // push 8
      { opcode: 'Push', operands: [5] }, // push 6
      { opcode: 'Sub' }, // sum 6 + 8
      { opcode: 'Store', operands: [1] }, // save 14 into c
      { opcode: 'Halt' }
    ])
  }))
})
