import { expect } from 'chai'
import { compileWithEvents, expectToRaiseCompileError } from '../helpers'

describe('mov', function () {
  it('successful movement', compileWithEvents('move(88);', function(vm, events) {
    events.once('move:start', (meters) => {
      expect(meters).to.eq(88)
      events.emit('move:end', true)
    })
  }, function(vm, bytecode, sourceMap, events) {
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [88] },
      { opcode: 'Mov' },
      { opcode: 'Pop' },

      { opcode: 'Halt' }
    ])

    expect(vm.stack.toArray()).to.deep.eq([])
  }))

  it('pass success as the result', compileWithEvents('let result : boolean = move(55);', function(vm, events) {
    events.once('move:start', (meters) => {
      expect(meters).to.eq(55)
      events.emit('move:end', true)
    })
  }, function(vm, bytecode, sourceMap, events) {
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },
      { opcode: 'Store', operands: [1] },

      { opcode: 'Push', operands: [55] },
      { opcode: 'Mov' },
      { opcode: 'Store', operands: [1] },
      { opcode: 'Halt' }
    ])

    expect(vm.frame.get(1)).to.eq(1)
    expect(vm.stack.toArray()).to.deep.eq([])
  }))


  it('dont allow text as argument', 
    expectToRaiseCompileError('move("test");', 'Argument number 1 should be number but is text for method move at line 1')
  )
})
