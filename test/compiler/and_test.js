import { expect } from 'chai'
import { compile } from '../helpers'

describe('And', function () {
  it('false and true', compile('let trueAndFalse : boolean = false and true;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(0)
    
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize trueAndFalse
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [0] },
      { opcode: 'Push', operands: [1] },
      { opcode: 'And' }, // false and true

      { opcode: 'Store', operands: [1] }, // store false
      { opcode: 'Halt' }
    ])
  }))

  it('true and true', compile('let trueAndFalse : boolean = true and true;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(1)
  }))

  it('false and false', compile('let trueAndFalse : boolean = false and false;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(0)
  }))
})
