import { expect } from 'chai'
import { compile, loadAndcompile } from '../helpers'

describe('<', function () {
  it('1 < 2', compile('let gte : boolean = 1 < 2;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(1)
    
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize gte
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [1] },
      { opcode: 'Push', operands: [2] },
      { opcode: 'IsGte' }, // is greater
      { opcode: 'Not' }, // is greater

      { opcode: 'Store', operands: [1] }, // store true
      { opcode: 'Halt' }
    ])
  }))

  it('2 < 1', compile('let gte : boolean = 2 < 1;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.gte(0)
  }))

  it('1 < 1', compile('let gte : boolean = 1 < 1;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.gte(0)
  }))
})
