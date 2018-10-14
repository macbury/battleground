import { expect } from 'chai'
import { compileWithEvents, expectToRaiseCompileError } from '../helpers'

describe('rotateCannon', function () {
  it('successful rotateCannon', compileWithEvents('rotateCannon(90);', function(vm, events) {
    events.once('rotateCannon:start', (degrees) => {
      expect(degrees).to.eq(90)
      events.emit('rotateCannon:end')
    })
  }, function(vm, bytecode, sourceMap, events) {
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [90] },
      { opcode: 'Roc' },
      { opcode: 'Push', operands: [0] },
      { opcode: 'Pop' },

      { opcode: 'Halt' }
    ])

    expect(vm.stack.toArray()).to.deep.eq([])
  }))

  it('dont allow text as argument', 
    expectToRaiseCompileError('rotateCannon("test");', 'Argument number 1 should be number but is text for method rotateCannon at line 1')
  )
})
