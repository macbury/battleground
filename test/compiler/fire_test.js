import { expect } from 'chai'
import { compileWithEvents, expectToRaiseCompileError } from '../helpers'

describe('fire', function () {
  it('successful rotateCannon', compileWithEvents('fire();', function(vm, events) {
    events.once('fire:start', () => {
      events.emit('fire:end')
    })
  }, function(vm, bytecode, sourceMap, events) {
    expect(bytecode).to.deep.eq([
      { opcode: 'Fie' },
      { opcode: 'Push', operands: [0] },
      { opcode: 'Pop' },

      { opcode: 'Halt' }
    ])

    expect(vm.stack.toArray()).to.deep.eq([])
  }))

  it('dont allow any argument', 
    expectToRaiseCompileError('fire("test");', 'Method fire have 0 arguments but you passed 1 at line 1')
  )
})
