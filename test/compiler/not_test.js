import { expect } from 'chai'
import { compile, loadAndcompile } from '../helpers'

describe('not', function () {
  it('a = not true', compile('let a : boolean = not true;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(0)
    
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize eq
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [1] },
      { opcode: 'Not' },

      { opcode: 'Store', operands: [1] }, // store true
      { opcode: 'Halt' }
    ])
  }))

  it('a = not false', compile('let a : boolean = not false;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(1)
  }))

  it('a = not c', compile("let c = false;\n let a : boolean = not c;", function(vm, bytecode) {
    expect(vm.frame.get(2)).to.deep.eq(1)
  }))
})
