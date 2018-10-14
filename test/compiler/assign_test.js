import { expect } from 'chai'
import { readFileSync } from 'fs'
import { compile, loadAndcompile, expectToRaiseCompileError, expectToLoadAndRaiseCompileError } from '../helpers'

describe('Assign', function () {
  it('a = false', compile('let eq = false;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(0)
  }))

  it('a = true', compile('let eq = true;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(1)
  }))

  it('a = 1000', compile('let eq = 1000;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(1000)
  }))

  it('prevent assign number to boolean', 
    expectToRaiseCompileError(
      "let eq : boolean = true;\neq = 111;", 
      'eq is type of boolean but you want assign number at line 2'
    )
  )

  it('prevent assign boolean to number', 
    expectToLoadAndRaiseCompileError(
      './test/factories/assign/bool_to_num.tank',
      'myVal is type of number but you want assign boolean at line 7'
    )
  )

  it('a : boolean = false', compile('let eq : boolean = false;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(0)
    
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize eq
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [0] },
      { opcode: 'Store', operands: [1] }, // store false
      { opcode: 'Halt' }
    ])
  }))

  it('a : boolean = true', compile('let eq : boolean = true;', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(1)
    
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize eq
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [1] },
      { opcode: 'Store', operands: [1] }, // store false
      { opcode: 'Halt' }
    ])
  }))

  describe('assign multiple variables', function() {
    it('generate bytecode', loadAndcompile('./test/factories/multiassign.tank', function (vm, bytecode) {
      expect(bytecode).to.deep.eq([
        { opcode: 'Push', operands: [0] }, // declare test
        { opcode: 'Store', operands: [1] },
        { opcode: 'Push', operands: [77] }, //load 77 to test
        { opcode: 'Store', operands: [1] },
        { opcode: 'Push', operands: [0] }, //declare c
        { opcode: 'Store', operands: [2] },
        { opcode: 'Push', operands: [0] }, // declare b
        { opcode: 'Store', operands: [3] },
        { opcode: 'Push', operands: [1] }, // load true to b
        { opcode: 'Store', operands: [3] },
        { opcode: 'Halt' }
      ])
    }))
  })

  describe('let a : number = 3', function() {
    it('generate bytecode', compile('let a : number = 3;', function (vm, bytecode) {
      expect(bytecode).to.deep.eq([
        { opcode: 'Push', operands: [0] },
        { opcode: 'Store', operands: [1] },
        { opcode: 'Push', operands: [3] },
        { opcode: 'Store', operands: [1] },
        { opcode: 'Halt' }
      ])
    }))
  })
})
