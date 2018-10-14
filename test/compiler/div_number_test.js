import { expect } from 'chai'
import { loadAndcompile } from '../helpers'

describe('/', function () {
  it('divide numbers', loadAndcompile('./test/factories/div_op.tank', function(vm, bytecode) {
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize mulResult
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [10] }, // push 10
      { opcode: 'Push', operands: [5] }, // push 5
      { opcode: 'Div' }, // 10 / 5

      { opcode: 'Store', operands: [1] }, // save 2 into mulResult
      { opcode: 'Halt' }
    ])

    expect(vm.frame.get(1)).to.deep.eq(2)
  }))
})
