import { expect } from 'chai'
import { loadAndcompile, compile, expectToLoadAndRaiseCompileError, expectToRaiseCompileError } from '../helpers'

describe('return', function () {
  it('allows to return value to assigned variable', loadAndcompile('./test/factories/methods/return.tank', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(1000)
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] }, // initialize hello variable
      { opcode: 'Store', operands: [1] },

      { opcode: 'Jmp', operands: [12] }, // dont run method,

      { opcode: 'Push', operands: [1000] },
      { opcode: 'Ret' },

      { opcode: 'Push', operands: [0] },
      { opcode: 'Ret' },

      { opcode: 'Call', operands: [6] },
      { opcode: 'Store', operands: [1] },
      { opcode: 'Halt' }
    ])
  }))

  it('can operate on passed variables', loadAndcompile('./test/factories/methods/max.tank', function(vm, bytecode) {
    expect(vm.frame.get(4)).to.eq(20)
    expect(vm.frame.get(5)).to.eq(30)
  }))

  it('can sum two variables and be triggered without return', loadAndcompile('./test/factories/methods/sum.tank', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.eq(12)
  }))

  it('cannot return void if specified return type', 
    expectToRaiseCompileError('test() : number { return; } test();', 'Method test returns number but you are returning none at line 1')
  )

  it('cannot return text if specified number type', 
    expectToRaiseCompileError('test() : number { return "text"; } test();', 'Method test requires to return number but you are returning text at line 1')
  )

  it('cannot return number if specified none type', 
    expectToRaiseCompileError('test() { return 12; } test();', 'Method test requires to return none but you are returning number at line 1')
  )

  it('allow void return', compile('test() { return; } test();', function(vm, bytecode) {
    expect(bytecode).to.deep.eq([
      { opcode: 'Jmp', operands: [8] },

      { opcode: 'Push', operands: [0] },
      { opcode: 'Ret' },

      { opcode: 'Push', operands: [0] },
      { opcode: 'Ret' },

      { opcode: 'Call', operands: [2] },
      { opcode: 'Pop' },
      { opcode: 'Halt' }
    ])
  }))
})
