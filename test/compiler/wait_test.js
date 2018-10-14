import { expect } from 'chai'
import { compileWithEvents, expectToRaiseCompileError } from '../helpers'

describe('wait', function () {
  it('sleeps for some time', compileWithEvents('wait(88);', function(vm, events) {
    events.once('sleep:start', (miliseconds) => {
      expect(miliseconds).to.eq(88)
      events.emit('sleep:end')
    })
  }, function(vm, bytecode, sourceMap, events) {
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [88] },
      { opcode: 'Slp' },
      { opcode: 'Push', operands: [0] },
      { opcode: 'Pop' },
      { opcode: 'Halt' }
    ])

    expect(vm.stack.toArray()).to.deep.eq([])
  }))

  it('dont return anything', 
    expectToRaiseCompileError('let a : number = wait(1);', 'a is type of number but you want assign none at line 1')
  )

  it('dont allow text as argument', 
    expectToRaiseCompileError('wait("test");', 'Argument number 1 should be number but is text for method wait at line 1')
  )

  it('dont allow boolean as argument', 
    expectToRaiseCompileError('wait("test");', 'Argument number 1 should be number but is text for method wait at line 1')
  )
})
