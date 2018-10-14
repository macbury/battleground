import { expect } from 'chai'
import { compileWithEvents, expectToRaiseCompileError } from '../helpers'

describe('turn', function () {
  it('successful turn', compileWithEvents('turn(90);', function(vm, events) {
    events.once('turn:start', (degrees) => {
      expect(degrees).to.eq(90)
      events.emit('turn:end')
    })
  }, function(vm, bytecode, sourceMap, events) {
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [90] },
      { opcode: 'Trn' },
      { opcode: 'Push', operands: [0] },
      { opcode: 'Pop' },

      { opcode: 'Halt' }
    ])

    expect(vm.stack.toArray()).to.deep.eq([])
  }))

  it('dont allow text as argument', 
    expectToRaiseCompileError('turn("test");', 'Argument number 1 should be number but is text for method turn at line 1')
  )
})
