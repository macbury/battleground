import { expect } from 'chai'
import { loadAndcompile } from '../helpers'

describe('if', function () {
  it('eval block if true', loadAndcompile('./test/factories/positive_if.tank', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(0)
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize exp
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [1] }, // set exp to true
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [1] },  // load if expression to stack(in this case if (true))
      { opcode: 'Not' }, // negate true to false
      { opcode: 'Jif', operands: [17] }, // jump to ignore if block
      
      { opcode: 'Push', operands: [0] },// set exp to false
      { opcode: 'Store', operands: [1] }, // store false
      
      { opcode: 'Halt' }
    ])
  }))

  it('skip block if false', loadAndcompile('./test/factories/negative_if.tank', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(1)
    
    expect(bytecode).to.deep.eq([
      { opcode: 'Push', operands: [0] },// initialize exp
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [1] }, // set exp to true
      { opcode: 'Store', operands: [1] }, 

      { opcode: 'Push', operands: [0] }, // load if expression to stack(in this case if (false))
      { opcode: 'Not' }, // negate false to true
      { opcode: 'Jif', operands: [17] }, // jump to ignore if block
      
      { opcode: 'Push', operands: [0] },// set exp to false
      { opcode: 'Store', operands: [1] }, // store false
      
      { opcode: 'Halt' }
    ])
  }))

  it('skip block if false', loadAndcompile('./test/factories/adv_if.tank', function(vm, bytecode) {
    expect(vm.frame.get(1)).to.deep.eq(1)
    expect(vm.frame.get(2)).to.deep.eq(15)
  }))
})
