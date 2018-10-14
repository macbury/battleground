import { expect } from 'chai'
import { compile } from '../helpers'

describe('Or', function () {
  it('false or true', compile('let trueOrFalse : boolean = false or true;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(1)
    
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize trueOrFalse
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [0] },
      { opcode: 'Push', operands: [1] },
      { opcode: 'Or' }, // false or true

      { opcode: 'Store', operands: [1] }, // store true
      { opcode: 'Halt' }
    ])
  }))

  it('true or true', compile('let trueOrFalse : boolean = false or true;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(1)
  }))

  it('false or false', compile('let trueOrFalse : boolean = false or false;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(0)
  }))
})
