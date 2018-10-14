import { expect } from 'chai'
import { compile, loadAndcompile } from '../helpers'

describe('==', function () {
  it('1 == 1', compile('let eq : boolean = 1 == 1;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(1)
    
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize eq
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [1] },
      { opcode: 'Push', operands: [1] },
      { opcode: 'IsEq' }, // false or true

      { opcode: 'Store', operands: [1] }, // store true
      { opcode: 'Halt' }
    ])
  }))

  it('10 == 0', compile('let eq : boolean = 10 == 0;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(0)
  }))

  it('4 == 16', compile('let eq : boolean = 4 == 16;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(0)
  }))

  it('true == false', compile('let eq : boolean = true == false;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(0)
  }))

  it('variable == number', loadAndcompile('./test/factories/eq_with_variable.tank', async function(vm, bytecode) {
    expect(vm.frame.get(2)).to.deep.eq(1)
  }))
})
