import { expect } from 'chai'
import { compileWithEvents, expectToRaiseCompileError } from '../helpers'

describe('message', function () {
  it('print text to io', compileWithEvents('message("Hello world!");', function(vm, events) {
    events.once('message', (text) => {
      expect(text).to.eq("Hello world!")
    })
  }, function(vm, bytecode, sourceMap, events) {
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: ["Hello world!"] },
      { opcode: 'Print' },
      { opcode: 'Push', operands: [0] },
      { opcode: 'Pop' },
      { opcode: 'Halt' }
    ])

    expect(vm.stack.toArray()).to.deep.eq([])
  }))

  it('dont allow number as argument', 
    expectToRaiseCompileError('message(1);', 'Argument number 1 should be text but is number for method message at line 1')
  )

  it('dont return anything', 
    expectToRaiseCompileError('let a : number = message("1");', 'a is type of number but you want assign none at line 1')
  )
})
