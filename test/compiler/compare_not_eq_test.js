import { expect } from 'chai'
import { compile, loadAndcompile } from '../helpers'

describe('!=', function () {
  it('1 != 2', compile('let eq : boolean = 1 != 2;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(1)
    
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize eq
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [1] },
      { opcode: 'Push', operands: [2] },
      { opcode: 'IsEq' }, 
      { opcode: 'Not' }, 

      { opcode: 'Store', operands: [1] }, // store true
      { opcode: 'Halt' }
    ])
  }))

  it('1 != 1', compile('let eq : boolean = 1 != 1;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(0)
  }))

  it('true != true', compile('let eq : boolean = true != true;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(0)
  }))
})
